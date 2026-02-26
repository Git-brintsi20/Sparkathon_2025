const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateVendor = [
  body('name').trim().notEmpty().withMessage('Vendor name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  handleValidationErrors,
];

const validateDelivery = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('vendorId').notEmpty().withMessage('Vendor ID is required'),
  body('vendorName').notEmpty().withMessage('Vendor name is required'),
  body('expectedDate').notEmpty().withMessage('Expected date is required'),
  handleValidationErrors,
];

const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateVendor, validateDelivery, validateObjectId, handleValidationErrors };
