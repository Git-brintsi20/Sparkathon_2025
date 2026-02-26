// Notification service - email + in-app notifications
const { sendEmail } = require('../utils/emailService');

class NotificationService {
  constructor() {
    this.subscribers = new Map(); // userId -> [callback]
  }

  // Send an in-app notification (for SSE/WebSocket)
  notify(userId, notification) {
    const callbacks = this.subscribers.get(userId) || [];
    callbacks.forEach(cb => cb(notification));
  }

  // Subscribe to notifications
  subscribe(userId, callback) {
    if (!this.subscribers.has(userId)) this.subscribers.set(userId, []);
    this.subscribers.get(userId).push(callback);
  }

  // Unsubscribe
  unsubscribe(userId, callback) {
    const callbacks = this.subscribers.get(userId) || [];
    this.subscribers.set(userId, callbacks.filter(cb => cb !== callback));
  }

  // Notify about delivery status change
  async notifyDeliveryStatusChange(delivery, oldStatus, newStatus) {
    const notification = {
      type: 'delivery_status',
      title: `Delivery ${delivery.orderId} status changed`,
      message: `Status changed from ${oldStatus} to ${newStatus}`,
      deliveryId: delivery._id,
      timestamp: new Date().toISOString(),
    };
    // In-app notification to all subscribers
    this.subscribers.forEach((callbacks, userId) => callbacks.forEach(cb => cb(notification)));
    return notification;
  }

  // Notify about fraud detection
  async notifyFraudDetected(delivery, fraudDetails) {
    const notification = {
      type: 'fraud_alert',
      title: `Fraud Alert: Delivery ${delivery.orderId}`,
      message: `Risk score: ${fraudDetails.riskScore}. ${fraudDetails.recommendation}`,
      severity: fraudDetails.riskScore >= 50 ? 'high' : 'medium',
      deliveryId: delivery._id,
      timestamp: new Date().toISOString(),
    };
    this.subscribers.forEach((callbacks, userId) => callbacks.forEach(cb => cb(notification)));
    return notification;
  }

  // Notify low compliance score
  async notifyLowCompliance(vendor) {
    if (vendor.complianceScore < 60) {
      const notification = {
        type: 'compliance_alert',
        title: `Low Compliance: ${vendor.name}`,
        message: `Compliance score dropped to ${vendor.complianceScore}`,
        vendorId: vendor._id,
        timestamp: new Date().toISOString(),
      };
      this.subscribers.forEach((callbacks, userId) => callbacks.forEach(cb => cb(notification)));
    }
  }
}

module.exports = new NotificationService();
