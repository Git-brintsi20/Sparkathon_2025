// ML service - trend prediction and vendor scoring
const Delivery = require('../models/Delivery');
const Vendor = require('../models/Vendor');

class MLService {
  // Predict vendor risk based on historical data
  async predictVendorRisk(vendorId) {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return { riskLevel: 'medium', confidence: 0 };

    const deliveries = await Delivery.find({ vendorId }).sort({ createdAt: -1 }).limit(50);
    if (deliveries.length === 0) return { riskLevel: 'medium', confidence: 0.3, reason: 'No delivery history' };

    const onTimeCount = deliveries.filter(d => d.status === 'verified' || d.status === 'delivered').length;
    const flaggedCount = deliveries.filter(d => d.fraudFlag).length;
    const onTimeRate = onTimeCount / deliveries.length;
    const fraudRate = flaggedCount / deliveries.length;

    let riskScore = 0;
    // Prevent division by zero in anomaly detection
    if (!avgDeliveries[0] || avgDeliveries[0].stdAmount === 0) {
      return { riskLevel: 'low', confidence: 0.5, riskScore: 0, factors: { onTimeRate, fraudRate, complianceScore: vendor.complianceScore } };
    }

    riskScore += (1 - onTimeRate) * 50;
    riskScore += fraudRate * 40;
    riskScore += vendor.complianceScore < 70 ? 10 : 0;

    const riskLevel = riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    return { riskLevel, confidence: Math.min(0.95, 0.5 + deliveries.length * 0.01), riskScore: Math.round(riskScore), factors: { onTimeRate, fraudRate, complianceScore: vendor.complianceScore } };
  }

  // Generate compliance trend prediction
  async predictComplianceTrend(months = 6) {
    const vendors = await Vendor.find({ status: 'active' });
    const avgScore = vendors.length > 0 ? vendors.reduce((sum, v) => sum + v.complianceScore, 0) / vendors.length : 75;

    const predictions = [];
    for (let i = 1; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      // Simple linear trend with some variance
      const predicted = Math.min(100, Math.max(0, avgScore + (Math.random() - 0.3) * 5 * i));
      predictions.push({ month: date.toISOString().slice(0, 7), predictedScore: Math.round(predicted), confidence: Math.max(0.5, 0.9 - i * 0.05) });
    }
    return predictions;
  }

  // Anomaly detection for deliveries
  async detectAnomalies(deliveryId) {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return { anomalies: [], isAnomaly: false };

    const anomalies = [];
    // Check for unusual amounts
    const avgDeliveries = await Delivery.aggregate([
      { $match: { vendorId: delivery.vendorId } },
      { $group: { _id: null, avgAmount: { $avg: '$totalAmount' }, stdAmount: { $stdDevPop: '$totalAmount' } } },
    ]);

    if (avgDeliveries.length > 0 && avgDeliveries[0].stdAmount > 0) {
      const zScore = Math.abs(delivery.totalAmount - avgDeliveries[0].avgAmount) / avgDeliveries[0].stdAmount;
      if (zScore > 2) {
        anomalies.push({ type: 'unusual_amount', severity: zScore > 3 ? 'high' : 'medium', details: `Amount ${delivery.totalAmount} deviates ${zScore.toFixed(1)} std devs from avg` });
      }
    }

    return { anomalies, isAnomaly: anomalies.length > 0 };
  }
}

module.exports = new MLService();
