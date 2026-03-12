const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/compliance-report', authorize('admin', 'manager'), analyticsController.getComplianceReport);
router.get('/vendors', authorize('admin', 'manager'), analyticsController.getVendorAnalytics);
router.get('/deliveries', analyticsController.getDeliveryAnalytics);
router.get('/performance', analyticsController.getPerformanceMetrics);
router.get('/fraud', authorize('admin', 'manager'), analyticsController.getFraudDetectionData);
router.get('/trends', authorize('admin'), analyticsController.getTrendAnalysis);
router.get('/predictive', authorize('admin'), analyticsController.getPredictiveAnalytics);
router.get('/quality', analyticsController.getQualityMetrics);
router.get('/realtime', analyticsController.getRealTimeMetrics);
router.get('/export', authorize('admin', 'manager'), analyticsController.exportReport);

module.exports = router;
