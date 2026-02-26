const mongoose = require('mongoose');

const ComplianceLogSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  type: {
    type: String,
    enum: ['audit', 'violation', 'certification', 'inspection', 'remediation', 'score_update'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  previousScore: { type: Number },
  newScore: { type: Number },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  evidence: [{ type: String }], // URLs to uploaded evidence files
  notes: { type: String },
  blockchainTxHash: { type: String },
}, { timestamps: true });

ComplianceLogSchema.index({ vendorId: 1, createdAt: -1 });
ComplianceLogSchema.index({ type: 1 });
ComplianceLogSchema.index({ status: 1 });

module.exports = mongoose.model('ComplianceLog', ComplianceLogSchema);
