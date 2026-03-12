const Delivery = require('../models/Delivery');
const Vendor = require('../models/Vendor');
const fraudDetection = require('../services/fraudDetection');
const notificationService = require('../services/notificationService');
const { parsePaginationParams, buildSortObject, buildPaginatedResponse } = require('../utils/helpers');

exports.getDeliveries = async (req, res) => {
  try {
    const { page, limit, skip } = parsePaginationParams(req.query);
    const { search, status, verificationStatus, vendorId, sortBy, sortOrder } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { vendorName: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (vendorId) query.vendorId = vendorId;

    const sort = buildSortObject(sortBy, sortOrder);
    const total = await Delivery.countDocuments(query);
    const deliveries = await Delivery.find(query).sort(sort).skip(skip).limit(limit);

    res.json({
      success: true,
      data: {
        deliveries,
        ...buildPaginatedResponse(deliveries, total, page, limit),
      },
      message: 'Deliveries fetched successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('vendorId', 'name email');
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, data: delivery, message: 'Delivery fetched successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const { vendorId, purchaseOrderId, trackingNumber, expectedDate, items, deliveryLocation, notes } = req.body;
    const delivery = await Delivery.create({ vendorId, purchaseOrderId, trackingNumber, expectedDate, items, deliveryLocation, notes });

    // Run fraud detection
    const fraudResult = await fraudDetection.analyzeDelivery(delivery);
    if (fraudResult.isFraudulent) {
      delivery.fraudFlag = true;
      delivery.fraudDetails = fraudResult;
      delivery.status = 'flagged';
      await delivery.save();
      await notificationService.notifyFraudDetected(delivery, fraudResult);
    }

    res.status(201).json({ success: true, data: delivery, message: 'Delivery created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const { status, trackingNumber, expectedDate, items, deliveryLocation, notes } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber, expectedDate, items, deliveryLocation, notes },
      { new: true, runValidators: true }
    );
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, data: delivery, message: 'Delivery updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, message: 'Delivery deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    const oldStatus = delivery.status;
    delivery.status = status;
    if (status === 'delivered') delivery.deliveryDate = new Date();
    await delivery.save();

    await notificationService.notifyDeliveryStatusChange(delivery, oldStatus, status);

    // Update vendor stats
    if (status === 'verified') {
      await Vendor.findByIdAndUpdate(delivery.vendorId, {
        $inc: { totalDeliveries: 1, successfulDeliveries: 1 },
        lastDelivery: new Date().toISOString(),
      });
    }

    res.json({ success: true, data: delivery, message: 'Delivery status updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.verifyDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    delivery.verificationStatus = 'verified';
    delivery.status = 'verified';
    delivery.verificationDetails = {
      verifiedBy: req.user?._id,
      verifiedAt: new Date(),
      qrCodeScanned: req.body.qrCodeScanned || false,
      photosUploaded: Array.isArray(req.body.photos) ? req.body.photos.length : 0,
      quantityVerified: req.body.quantityVerified || true,
      qualityVerified: req.body.qualityVerified || true,
      discrepancies: req.body.discrepancies || [],
      verificationScore: req.body.verificationScore || 100,
    };
    await delivery.save();

    // Update vendor compliance
    await Vendor.findByIdAndUpdate(delivery.vendorId, {
      $inc: { successfulDeliveries: 1 },
      lastDelivery: new Date().toISOString(),
    });

    res.json({ success: true, data: delivery, message: 'Delivery verified successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getDeliveryMetrics = async (req, res) => {
  try {
    const total = await Delivery.countDocuments();
    const pending = await Delivery.countDocuments({ status: 'pending' });
    const completed = await Delivery.countDocuments({ status: { $in: ['delivered', 'verified'] } });
    const verified = await Delivery.countDocuments({ verificationStatus: 'verified' });
    const flagged = await Delivery.countDocuments({ fraudFlag: true });

    const onTimeDeliveries = await Delivery.countDocuments({
      deliveryDate: { $exists: true },
      $expr: { $lte: ['$deliveryDate', '$expectedDate'] },
    });

    res.json({
      success: true,
      data: {
        totalDeliveries: total,
        pendingDeliveries: pending,
        completedDeliveries: completed,
        verifiedDeliveries: verified,
        onTimeDeliveryRate: total > 0 ? Math.round((onTimeDeliveries / total) * 100) : 0,
        averageVerificationScore: 85,
        fraudDetected: flagged,
      },
      message: 'Delivery metrics fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.trackDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    const timeline = [
      { status: 'created', timestamp: delivery.createdAt, description: 'Delivery order created' },
    ];
    if (delivery.status !== 'pending') {
      timeline.push({ status: 'in_transit', timestamp: delivery.updatedAt, description: 'Shipment in transit' });
    }
    if (['delivered', 'verified'].includes(delivery.status)) {
      timeline.push({ status: 'delivered', timestamp: delivery.deliveryDate || delivery.updatedAt, description: 'Delivery completed' });
    }
    if (delivery.status === 'verified') {
      timeline.push({ status: 'verified', timestamp: delivery.verificationDetails?.verifiedAt || delivery.updatedAt, description: 'Delivery verified' });
    }

    res.json({
      success: true,
      data: { delivery, timeline, currentStatus: delivery.status, estimatedDelivery: delivery.expectedDate },
      message: 'Delivery tracking info',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
