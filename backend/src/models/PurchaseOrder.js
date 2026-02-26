const mongoose = require('mongoose');

const PurchaseOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  unit: { type: String, default: 'units' },
});

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorName: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'draft',
  },
  items: [PurchaseOrderItemSchema],
  totalAmount: { type: Number, required: true },
  expectedDeliveryDate: { type: Date },
  actualDeliveryDate: { type: Date },
  shippingAddress: { type: String },
  notes: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
}, { timestamps: true });

PurchaseOrderSchema.index({ vendorId: 1 });
PurchaseOrderSchema.index({ status: 1 });

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
