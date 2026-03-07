// Fraud detection service - anomaly detection for deliveries
const Delivery = require('../models/Delivery');
const Vendor = require('../models/Vendor');

class FraudDetectionService {
  // Analyze a delivery for potential fraud
  async analyzeDelivery(delivery) {
    const flags = [];
    let riskScore = 0;

    // Check 1: Quantity mismatch
    if (delivery.items) {
      for (const item of delivery.items) {
        if (item.expectedQuantity && item.quantity !== item.expectedQuantity) {
          const deviation = Math.abs(item.quantity - item.expectedQuantity) / item.expectedQuantity;
          if (deviation > 0.1) {
            flags.push({ type: 'quantity_mismatch', severity: deviation > 0.3 ? 'high' : 'medium', item: item.name, deviation: Math.round(deviation * 100) + '%' });
            riskScore += deviation > 0.3 ? 30 : 15;
          }
        }
      }
    }

    // Check 2: Late delivery
    if (delivery.deliveryDate && delivery.expectedDate) {
      const daysLate = (new Date(delivery.deliveryDate) - new Date(delivery.expectedDate)) / (1000 * 60 * 60 * 24);
      if (daysLate > 3) {
        flags.push({ type: 'late_delivery', severity: daysLate > 7 ? 'high' : 'medium', daysLate: Math.round(daysLate) });
        riskScore += daysLate > 7 ? 25 : 10;
      }
    }

    // Check 3: Vendor history
    const vendor = await Vendor.findById(delivery.vendorId);
    if (vendor && vendor.complianceScore < 60) {
      flags.push({ type: 'low_compliance_vendor', severity: 'high', vendorScore: vendor.complianceScore });
      riskScore += 20;
    }

    // Check 4: Damaged items
    if (delivery.items) {
      const damagedCount = delivery.items.filter(i => i.condition === 'damaged' || i.condition === 'expired').length;
      if (damagedCount > 0) {
        flags.push({ type: 'damaged_items', severity: damagedCount > 2 ? 'high' : 'medium', count: damagedCount });
        riskScore += damagedCount * 10;
      }
    }

    return {
      isFraudulent: riskScore >= 50,
      riskScore: Math.min(100, riskScore),
      flags,
      recommendation: riskScore >= 50 ? 'Manual review required' : riskScore >= 25 ? 'Monitor closely' : 'No action needed',
    };
  }

  // Get fraud stats for the dashboard
  async getFraudStats() {
    const flaggedDeliveries = await Delivery.countDocuments({ fraudFlag: true });
    const totalDeliveries = await Delivery.countDocuments();
    const recentFraud = await Delivery.find({ fraudFlag: true }).sort({ createdAt: -1 }).limit(10).select('orderId vendorName fraudDetails createdAt');

    return {
      totalFlagged: flaggedDeliveries,
      fraudRate: totalDeliveries > 0 ? ((flaggedDeliveries / totalDeliveries) * 100).toFixed(1) : 0,
      recentAlerts: recentFraud,
    };
  }
}

module.exports = new FraudDetectionService();
