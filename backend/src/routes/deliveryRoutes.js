const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');
const { validateDelivery } = require('../middleware/validation');
const { upload } = require('../middleware/fileUpload');

router.use(protect);

router.get('/', deliveryController.getDeliveries);
router.get('/metrics', deliveryController.getDeliveryMetrics);
router.get('/:id', deliveryController.getDeliveryById);
router.get('/:id/track', deliveryController.trackDelivery);
router.post('/', validateDelivery, deliveryController.createDelivery);
router.put('/:id', deliveryController.updateDelivery);
router.put('/:id/status', deliveryController.updateDeliveryStatus);
router.put('/:id/verify', deliveryController.verifyDelivery);
router.delete('/:id', authorize('admin', 'manager'), deliveryController.deleteDelivery);

module.exports = router;
