const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  // null userId means broadcast to all
  type: {
    type: String,
    enum: ['delivery_status', 'fraud_alert', 'compliance_alert', 'system', 'info', 'success', 'warning', 'error'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
  isRead: { type: Boolean, default: false },
  metadata: {
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    link: String,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
