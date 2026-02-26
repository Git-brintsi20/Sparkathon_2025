const blockchainService = require('../services/blockchainService');
const Vendor = require('../models/Vendor');
const Delivery = require('../models/Delivery');
const ComplianceLog = require('../models/ComplianceLog');

exports.getNetworkInfo = async (req, res) => {
  try {
    const info = {
      isDemoMode: blockchainService.isDemoMode,
      isInitialized: blockchainService.isInitialized,
      networkId: blockchainService.networkId,
    };
    res.json({ success: true, data: info, message: 'Blockchain network info' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.registerVendor = async (req, res) => {
  try {
    const { vendorId } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const result = await blockchainService.registerVendor({
      name: vendor.name,
      email: vendor.email,
      walletAddress: req.body.walletAddress,
      certifications: req.body.certifications || [],
    });

    vendor.blockchainId = result.vendorId;
    vendor.blockchainTxHash = result.transactionHash;
    await vendor.save();

    await ComplianceLog.create({
      vendorId: vendor._id,
      type: 'audit',
      description: 'Vendor registered on blockchain',
      blockchainTxHash: result.transactionHash,
    });

    res.json({ success: true, data: result, message: 'Vendor registered on blockchain' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCompliance = async (req, res) => {
  try {
    const { vendorId, score, reason } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const result = await blockchainService.updateVendorCompliance(
      vendor.blockchainId || vendorId,
      score,
      reason
    );

    vendor.complianceScore = score;
    await vendor.save();

    await ComplianceLog.create({
      vendorId: vendor._id,
      type: 'score_update',
      description: reason || `Compliance score updated to ${score}`,
      blockchainTxHash: result.transactionHash,
    });

    res.json({ success: true, data: result, message: 'Compliance updated on blockchain' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });

    const result = await blockchainService.createDelivery({
      vendorId: delivery.vendorId,
      purchaseOrderId: delivery.orderId,
      trackingNumber: delivery.trackingNumber,
      expectedDeliveryDate: delivery.expectedDate,
      deliveryLocation: delivery.deliveryLocation || 'Warehouse',
      items: delivery.items?.map(i => i.name) || [],
      totalValue: delivery.items?.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0) || 0,
    });

    delivery.blockchainTxHash = result.transactionHash;
    await delivery.save();

    res.json({ success: true, data: result, message: 'Delivery recorded on blockchain' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getComplianceHistory = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const logs = await ComplianceLog.find({
      vendorId,
      blockchainTxHash: { $exists: true, $ne: null },
    }).sort({ createdAt: -1 });

    const history = logs.map(log => ({
      id: log._id,
      type: log.type,
      description: log.description,
      txHash: log.blockchainTxHash,
      explorerUrl: blockchainService.getExplorerUrl(log.blockchainTxHash),
      timestamp: log.createdAt,
    }));

    res.json({ success: true, data: history, message: 'Blockchain compliance history' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const logs = await ComplianceLog.find({
      blockchainTxHash: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('vendorId', 'name');

    const transactions = logs.map(log => ({
      id: log._id,
      type: log.type,
      vendorName: log.vendorId?.name || 'Unknown',
      description: log.description,
      txHash: log.blockchainTxHash,
      explorerUrl: blockchainService.getExplorerUrl(log.blockchainTxHash),
      timestamp: log.createdAt,
    }));

    res.json({ success: true, data: transactions, message: 'Blockchain transactions' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyTransaction = async (req, res) => {
  try {
    const { txHash } = req.params;
    const log = await ComplianceLog.findOne({ blockchainTxHash: txHash });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Transaction not found in records' });
    }

    res.json({
      success: true,
      data: {
        txHash,
        type: log.type,
        description: log.description,
        explorerUrl: blockchainService.getExplorerUrl(txHash),
        verified: true,
        timestamp: log.createdAt,
      },
      message: 'Transaction verified',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
