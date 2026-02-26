
const Vendor = require('../models/Vendor');

// Get all vendors (with pagination and filters)
exports.getVendors = async (req, res) => {
	try {
		const { page = 1, limit = 10, search, status, category, riskLevel } = req.query;
		const query = {};
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } }
			];
		}
		if (status) query.status = status;
		if (category) query.category = category;
		if (riskLevel) query.riskLevel = riskLevel;

		const total = await Vendor.countDocuments(query);
		const vendors = await Vendor.find(query)
			.skip((page - 1) * limit)
			.limit(Number(limit));

		res.json({
			success: true,
			data: {
				data: vendors,
				page: Number(page),
				limit: Number(limit),
				total,
				totalPages: Math.ceil(total / limit),
				hasNext: page < Math.ceil(total / limit),
				hasPrevious: page > 1
			},
			message: 'Vendors fetched successfully'
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
	try {
		const vendor = await Vendor.findById(req.params.id);
		if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
		res.json({ success: true, data: vendor, message: 'Vendor fetched successfully' });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

// Create vendor
exports.createVendor = async (req, res) => {
	try {
		const vendor = new Vendor(req.body);
		await vendor.save();
		res.status(201).json({ success: true, data: vendor, message: 'Vendor created successfully' });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};

// Update vendor
exports.updateVendor = async (req, res) => {
	try {
		const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
		res.json({ success: true, data: vendor, message: 'Vendor updated successfully' });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
	try {
		const vendor = await Vendor.findByIdAndDelete(req.params.id);
		if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
		res.json({ success: true, data: { success: true }, message: 'Vendor deleted successfully' });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};
