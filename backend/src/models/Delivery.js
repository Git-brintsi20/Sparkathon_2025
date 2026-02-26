const mongoose = require('mongoose');

const DeliveryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expectedQuantity: { type: Number, required: true },
  unit: { type: String, default: 'units' },
  price: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  condition: { type: String, enum: ['good', 'damaged', 'expired'], default: 'good' },
  notes: { type: String },
});

const VerificationDetailsSchema = new mongoose.Schema({
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  qrCodeScanned: { type: Boolean, default: false },
  photosUploaded: { type: Number, default: 0 },
  quantityVerified: { type: Boolean, default: false },
  qualityVerified: { type: Boolean, default: false },
  discrepancies: [{ type: String }],
  verificationScore: { type: Number, default: 0 },
});

const DeliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorName: { type: String, required: true },
  deliveryDate: { type: Date },
  expectedDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'delivered', 'verified', 'rejected', 'flagged'],
    default: 'pending',
  },
  items: [DeliveryItemSchema],
  totalAmount: { type: Number, default: 0 },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending',
  },
  verificationDetails: VerificationDetailsSchema,
  photos: [{ type: String }],
  notes: { type: String, default: '' },
  trackingNumber: { type: String },
  barcode: { type: String },
  weight: { type: Number },
  quantity: { type: Number },
  condition: { type: String },
  blockchainTxHash: { type: String },
  fraudFlag: { type: Boolean, default: false },
  fraudDetails: { type: Object },
}, { timestamps: true });

DeliverySchema.index({ vendorId: 1, status: 1 });
DeliverySchema.index({ orderId: 1 });
DeliverySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Delivery', DeliverySchema);
