const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');
const { protect, authorize } = require('../middleware/auth');

router.get('/network', blockchainController.getNetworkInfo);
router.get('/transactions', protect, blockchainController.getTransactions);
router.get('/verify/:txHash', blockchainController.verifyTransaction);
router.get('/compliance-history/:vendorId', protect, blockchainController.getComplianceHistory);

router.use(protect);
router.use(authorize('admin', 'manager'));

router.post('/register-vendor', blockchainController.registerVendor);
router.post('/update-compliance', blockchainController.updateCompliance);
router.post('/create-delivery', blockchainController.createDelivery);

module.exports = router;
