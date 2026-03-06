const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/compliance-report', analyticsController.getComplianceReport);
router.get('/vendors', analyticsController.getVendorAnalytics);
router.get('/deliveries', analyticsController.getDeliveryAnalytics);
router.get('/performance', analyticsController.getPerformanceMetrics);
router.get('/fraud', analyticsController.getFraudDetectionData);
router.get('/trends', analyticsController.getTrendAnalysis);
router.get('/predictive', analyticsController.getPredictiveAnalytics);
router.get('/quality', analyticsController.getQualityMetrics);
router.get('/realtime', analyticsController.getRealTimeMetrics);
router.get('/export', authorize('admin', 'manager'), analyticsController.exportReport);

module.exports = router;
