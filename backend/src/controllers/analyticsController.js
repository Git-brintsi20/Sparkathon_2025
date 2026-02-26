const Delivery = require('../models/Delivery');
const Vendor = require('../models/Vendor');
const ComplianceLog = require('../models/ComplianceLog');
const PurchaseOrder = require('../models/PurchaseOrder');
const fraudDetection = require('../services/fraudDetection');
const mlService = require('../services/mlService');

exports.getDashboard = async (req, res) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const activeVendors = await Vendor.countDocuments({ status: 'active' });
    const totalDeliveries = await Delivery.countDocuments();
    const pendingDeliveries = await Delivery.countDocuments({ status: 'pending' });
    const totalOrders = await PurchaseOrder.countDocuments();
    const flagged = await Delivery.countDocuments({ fraudFlag: true });

    const avgCompliance = await Vendor.aggregate([
      { $group: { _id: null, avg: { $avg: '$complianceScore' } } },
    ]);

    const recentDeliveries = await Delivery.find().sort({ createdAt: -1 }).limit(10);
    const recentLogs = await ComplianceLog.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalVendors,
          activeVendors,
          totalDeliveries,
          pendingDeliveries,
          totalOrders,
          fraudDetected: flagged,
          averageCompliance: avgCompliance[0]?.avg || 0,
        },
        recentDeliveries,
        recentComplianceLogs: recentLogs,
      },
      message: 'Dashboard data fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getComplianceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const logQuery = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};
    const logs = await ComplianceLog.find(logQuery).sort({ createdAt: -1 }).limit(100);

    const byType = await ComplianceLog.aggregate([
      ...(Object.keys(dateFilter).length ? [{ $match: { createdAt: dateFilter } }] : []),
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const bySeverity = await ComplianceLog.aggregate([
      ...(Object.keys(dateFilter).length ? [{ $match: { createdAt: dateFilter } }] : []),
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: { logs, byType, bySeverity, total: logs.length },
      message: 'Compliance report generated',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVendorAnalytics = async (req, res) => {
  try {
    const riskDistribution = await Vendor.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
    ]);

    const categoryDistribution = await Vendor.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgScore: { $avg: '$complianceScore' } } },
    ]);

    const topVendors = await Vendor.find().sort({ complianceScore: -1 }).limit(10).select('name complianceScore riskLevel category');
    const bottomVendors = await Vendor.find().sort({ complianceScore: 1 }).limit(10).select('name complianceScore riskLevel category');

    res.json({
      success: true,
      data: { riskDistribution, categoryDistribution, topVendors, bottomVendors },
      message: 'Vendor analytics fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDeliveryAnalytics = async (req, res) => {
  try {
    const statusDistribution = await Delivery.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const monthlyDeliveries = await Delivery.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
          verified: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const fraudStats = await fraudDetection.getFraudStats();

    res.json({
      success: true,
      data: { statusDistribution, monthlyDeliveries, fraudStats },
      message: 'Delivery analytics fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPerformanceMetrics = async (req, res) => {
  try {
    const totalDeliveries = await Delivery.countDocuments();
    const onTime = await Delivery.countDocuments({
      deliveryDate: { $exists: true },
      $expr: { $lte: ['$deliveryDate', '$expectedDate'] },
    });
    const verified = await Delivery.countDocuments({ verificationStatus: 'verified' });

    const avgProcessingTime = await Delivery.aggregate([
      { $match: { deliveryDate: { $exists: true } } },
      {
        $project: {
          processingDays: { $divide: [{ $subtract: ['$deliveryDate', '$createdAt'] }, 86400000] },
        },
      },
      { $group: { _id: null, avg: { $avg: '$processingDays' } } },
    ]);

    res.json({
      success: true,
      data: {
        onTimeDeliveryRate: totalDeliveries > 0 ? Math.round((onTime / totalDeliveries) * 100) : 0,
        verificationRate: totalDeliveries > 0 ? Math.round((verified / totalDeliveries) * 100) : 0,
        averageProcessingTime: Math.round(avgProcessingTime[0]?.avg || 0),
        totalDeliveries,
      },
      message: 'Performance metrics fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFraudDetectionData = async (req, res) => {
  try {
    const flaggedDeliveries = await Delivery.find({ fraudFlag: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('vendorId', 'name');

    const stats = await fraudDetection.getFraudStats();

    res.json({
      success: true,
      data: { flaggedDeliveries, ...stats },
      message: 'Fraud detection data fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrendAnalysis = async (req, res) => {
  try {
    const complianceTrend = await Vendor.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          avgScore: { $avg: '$complianceScore' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const deliveryTrend = await Delivery.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: 1 },
          onTime: { $sum: { $cond: [{ $lte: ['$deliveryDate', '$expectedDate'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: { complianceTrend, deliveryTrend },
      message: 'Trend analysis fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPredictiveAnalytics = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('name complianceScore riskLevel');
    const predictions = [];

    for (const vendor of vendors.slice(0, 20)) {
      const risk = await mlService.predictVendorRisk(vendor._id.toString());
      predictions.push({ vendorId: vendor._id, vendorName: vendor.name, ...risk });
    }

    res.json({
      success: true,
      data: { predictions },
      message: 'Predictive analytics generated',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getQualityMetrics = async (req, res) => {
  try {
    const vendorQuality = await Vendor.aggregate([
      {
        $project: {
          name: 1,
          complianceScore: 1,
          deliveryRate: {
            $cond: [
              { $gt: ['$totalDeliveries', 0] },
              { $multiply: [{ $divide: ['$successfulDeliveries', '$totalDeliveries'] }, 100] },
              0,
            ],
          },
        },
      },
      { $sort: { deliveryRate: -1 } },
      { $limit: 20 },
    ]);

    res.json({
      success: true,
      data: { vendorQuality },
      message: 'Quality metrics fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRealTimeMetrics = async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    const last24h = {
      deliveries: await Delivery.countDocuments({ createdAt: { $gte: oneDayAgo } }),
      verified: await Delivery.countDocuments({ createdAt: { $gte: oneDayAgo }, verificationStatus: 'verified' }),
      flagged: await Delivery.countDocuments({ createdAt: { $gte: oneDayAgo }, fraudFlag: true }),
      newVendors: await Vendor.countDocuments({ createdAt: { $gte: oneDayAgo } }),
    };

    res.json({
      success: true,
      data: { last24h, timestamp: now },
      message: 'Real-time metrics fetched',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { type } = req.query;
    let data;

    switch (type) {
      case 'vendors':
        data = await Vendor.find().lean();
        break;
      case 'deliveries':
        data = await Delivery.find().lean();
        break;
      case 'compliance':
        data = await ComplianceLog.find().lean();
        break;
      default:
        data = { vendors: await Vendor.countDocuments(), deliveries: await Delivery.countDocuments() };
    }

    res.json({ success: true, data, message: `${type || 'summary'} report exported` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
