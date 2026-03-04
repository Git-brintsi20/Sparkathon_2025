// Notification service - Socket.IO + MongoDB persistence + email alerts
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailService');

class NotificationService {
  constructor() {
    this.io = null; // Set by server.js after Socket.IO init
  }

  // Called from server.js to inject the Socket.IO instance
  setIO(io) {
    this.io = io;
    console.log('NotificationService: Socket.IO attached');
  }

  // ---- Core: create, persist, and emit a notification ----
  async create({ userId, type, title, message, severity = 'low', metadata = {} }) {
    // 1. Persist to MongoDB
    const notification = await Notification.create({
      userId: userId || null,
      type,
      title,
      message,
      severity,
      metadata,
    });

    // 2. Emit via Socket.IO
    const payload = {
      id: notification._id.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      severity: notification.severity,
      isRead: false,
      metadata: notification.metadata,
      createdAt: notification.createdAt.toISOString(),
    };

    if (this.io) {
      if (userId) {
        this.io.to(`user:${userId}`).emit('notification', payload);
      } else {
        this.io.emit('notification', payload);
      }
    }

    return notification;
  }

  // ---- Specific notification types ----

  async notifyDeliveryStatusChange(delivery, oldStatus, newStatus) {
    return this.create({
      type: 'delivery_status',
      title: `Delivery ${delivery.orderId} status changed`,
      message: `Status changed from ${oldStatus} to ${newStatus}`,
      severity: newStatus === 'flagged' ? 'high' : 'low',
      metadata: { deliveryId: delivery._id, link: `/deliveries/${delivery._id}` },
    });
  }

  async notifyFraudDetected(delivery, fraudDetails) {
    const severity = fraudDetails.riskScore >= 70 ? 'critical' : fraudDetails.riskScore >= 50 ? 'high' : 'medium';

    const notification = await this.create({
      type: 'fraud_alert',
      title: `Fraud Alert: Delivery ${delivery.orderId}`,
      message: `Risk score: ${fraudDetails.riskScore}. ${fraudDetails.recommendation || 'Review required.'}`,
      severity,
      metadata: { deliveryId: delivery._id, link: `/deliveries/${delivery._id}` },
    });

    // Send email for high-severity fraud
    if (severity === 'critical' || severity === 'high') {
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: `Fraud Alert: Delivery ${delivery.orderId}`,
          html: `
            <h2 style="color:#dc2626;">Fraud Alert</h2>
            <p><strong>Delivery:</strong> ${delivery.orderId}</p>
            <p><strong>Risk Score:</strong> ${fraudDetails.riskScore}/100</p>
            <p><strong>Recommendation:</strong> ${fraudDetails.recommendation || 'Immediate review required'}</p>
            <p><strong>Detected at:</strong> ${new Date().toLocaleString()}</p>
            <hr/>
            <p style="color:#666;">Smart Vendor Compliance System</p>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send fraud alert email:', emailErr.message);
      }
    }

    return notification;
  }

  async notifyLowCompliance(vendor) {
    if (vendor.complianceScore >= 60) return null;

    const severity = vendor.complianceScore < 30 ? 'critical' : vendor.complianceScore < 45 ? 'high' : 'medium';

    const notification = await this.create({
      type: 'compliance_alert',
      title: `Low Compliance: ${vendor.name}`,
      message: `Compliance score dropped to ${vendor.complianceScore}`,
      severity,
      metadata: { vendorId: vendor._id, link: `/vendors/${vendor._id}` },
    });

    if (severity === 'critical' || severity === 'high') {
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: `Low Compliance Alert: ${vendor.name}`,
          html: `
            <h2 style="color:#f59e0b;">Compliance Alert</h2>
            <p><strong>Vendor:</strong> ${vendor.name}</p>
            <p><strong>Score:</strong> ${vendor.complianceScore}/100</p>
            <p><strong>Status:</strong> ${vendor.status || 'Unknown'}</p>
            <hr/>
            <p style="color:#666;">Smart Vendor Compliance System</p>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send compliance alert email:', emailErr.message);
      }
    }

    return notification;
  }

  async notifySystem(title, message, severity = 'low') {
    return this.create({ type: 'system', title, message, severity });
  }

  // ---- Query methods (used by REST controller) ----

  async getNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    const query = { $or: [{ userId }, { userId: null }] };
    if (unreadOnly) query.isRead = false;

    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(query),
    ]);

    return { notifications, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getUnreadCount(userId) {
    return Notification.countDocuments({
      $or: [{ userId }, { userId: null }],
      isRead: false,
    });
  }

  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, $or: [{ userId }, { userId: null }] },
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(userId) {
    return Notification.updateMany(
      { $or: [{ userId }, { userId: null }], isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(notificationId, userId) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      $or: [{ userId }, { userId: null }],
    });
  }
}

module.exports = new NotificationService();
