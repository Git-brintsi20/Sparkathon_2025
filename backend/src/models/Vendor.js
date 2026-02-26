
const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	address: { type: String },
	category: { type: String },
	registrationDate: { type: String },
	status: { type: String, default: 'active' },
	complianceScore: { type: Number, default: 75 },
	riskLevel: { type: String, default: 'medium' },
	documents: [{ type: Object }],
	contacts: [{ type: Object }],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	industry: { type: String },
	website: { type: String },
	contactPerson: { type: String },
	taxId: { type: String },
	totalDeliveries: { type: Number, default: 0 },
	successfulDeliveries: { type: Number, default: 0 },
	lastDelivery: { type: String },
	notes: { type: String },
});

module.exports = mongoose.model('Vendor', VendorSchema);
