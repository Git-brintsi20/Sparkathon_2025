const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const vendorController = require('../controllers/vendorController');

router.use(protect);

router.get('/', vendorController.getVendors);
router.get('/:id', vendorController.getVendorById);
router.post('/', authorize('admin', 'manager'), vendorController.createVendor);
router.put('/:id', authorize('admin', 'manager'), vendorController.updateVendor);
router.delete('/:id', authorize('admin'), vendorController.deleteVendor);

module.exports = router;
