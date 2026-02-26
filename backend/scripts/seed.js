// backend/scripts/seed.js
// Run: node scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('../src/config/database');
const User = require('../src/models/User');
const Vendor = require('../src/models/Vendor');
const Delivery = require('../src/models/Delivery');
const ComplianceLog = require('../src/models/ComplianceLog');
const PurchaseOrder = require('../src/models/PurchaseOrder');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    Delivery.deleteMany({}),
    ComplianceLog.deleteMany({}),
    PurchaseOrder.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create users
  const users = await User.create([
    { name: 'Admin User', email: 'admin@walmart.com', password: 'Admin123!', role: 'admin' },
    { name: 'John Manager', email: 'john@walmart.com', password: 'Manager123!', role: 'manager' },
    { name: 'Jane Inspector', email: 'jane@walmart.com', password: 'Inspector123!', role: 'inspector' },
    { name: 'Viewer User', email: 'viewer@walmart.com', password: 'Viewer123!', role: 'viewer' },
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Create vendors
  const vendors = await Vendor.create([
    {
      name: 'TechCorp Solutions',
      email: 'info@techcorp.com',
      phone: '+1-555-0101',
      address: '123 Tech Drive, San Francisco, CA 94105',
      category: 'Technology',
      status: 'active',
      complianceScore: 95,
      riskLevel: 'low',
      totalDeliveries: 150,
      successfulDeliveries: 147,
      lastDelivery: '2024-06-15',
    },
    {
      name: 'Global Supply Co',
      email: 'orders@globalsupply.com',
      phone: '+1-555-0102',
      address: '456 Commerce Blvd, Houston, TX 77001',
      category: 'General Supplies',
      status: 'active',
      complianceScore: 88,
      riskLevel: 'medium',
      totalDeliveries: 230,
      successfulDeliveries: 210,
      lastDelivery: '2024-06-14',
    },
    {
      name: 'Swift Logistics Ltd',
      email: 'dispatch@swiftlogistics.com',
      phone: '+1-555-0103',
      address: '789 Warehouse Blvd, Chicago, IL 60601',
      category: 'Logistics',
      status: 'active',
      complianceScore: 92,
      riskLevel: 'low',
      totalDeliveries: 203,
      successfulDeliveries: 198,
      lastDelivery: '2024-06-12',
    },
    {
      name: 'Premium Catering Services',
      email: 'orders@premiumcatering.com',
      phone: '+1-555-0104',
      address: '321 Culinary Way, New York, NY 10001',
      category: 'Food & Beverage',
      status: 'suspended',
      complianceScore: 65,
      riskLevel: 'high',
      totalDeliveries: 45,
      successfulDeliveries: 38,
      lastDelivery: '2024-05-15',
    },
    {
      name: 'Green Energy Solutions',
      email: 'info@greenenergy.com',
      phone: '+1-555-0105',
      address: '654 Solar Drive, Austin, TX 78701',
      category: 'Energy',
      status: 'active',
      complianceScore: 98,
      riskLevel: 'low',
      totalDeliveries: 76,
      successfulDeliveries: 76,
      lastDelivery: '2024-06-16',
    },
    {
      name: 'Office Supplies Plus',
      email: 'sales@officesupplies.com',
      phone: '+1-555-0106',
      address: '987 Business Park, Denver, CO 80201',
      category: 'Office Supplies',
      status: 'active',
      complianceScore: 83,
      riskLevel: 'medium',
      totalDeliveries: 112,
      successfulDeliveries: 108,
      lastDelivery: '2024-06-11',
    },
    {
      name: 'Healthcare Supplies Inc',
      email: 'orders@healthcaresupplies.com',
      phone: '+1-555-0107',
      address: '258 Medical Center Dr, Boston, MA 02101',
      category: 'Healthcare',
      status: 'active',
      complianceScore: 97,
      riskLevel: 'low',
      totalDeliveries: 134,
      successfulDeliveries: 132,
      lastDelivery: '2024-06-13',
    },
    {
      name: 'Construction Materials Ltd',
      email: 'quotes@constructionmaterials.com',
      phone: '+1-555-0108',
      address: '369 Builder Street, Phoenix, AZ 85001',
      category: 'Construction',
      status: 'inactive',
      complianceScore: 79,
      riskLevel: 'medium',
      totalDeliveries: 23,
      successfulDeliveries: 21,
      lastDelivery: '2024-03-28',
    },
  ]);
  console.log(`✅ Created ${vendors.length} vendors`);

  // Create deliveries
  const deliveries = await Delivery.create([
    {
      orderId: 'PO-2024-001',
      vendorId: vendors[0]._id,
      vendorName: vendors[0].name,
      status: 'verified',
      verificationStatus: 'verified',
      expectedDate: new Date('2024-06-15'),
      deliveryDate: new Date('2024-06-15'),
      items: [
        { name: 'Laptop Computers', quantity: 10, price: 999.99, expectedQuantity: 10, condition: 'good' },
        { name: 'USB-C Cables', quantity: 50, price: 12.99, expectedQuantity: 50, condition: 'good' },
      ],
      deliveryLocation: 'Warehouse A',
      trackingNumber: 'TRK-TC-001',
      notes: 'All items in perfect condition',
    },
    {
      orderId: 'PO-2024-002',
      vendorId: vendors[1]._id,
      vendorName: vendors[1].name,
      status: 'pending',
      verificationStatus: 'pending',
      expectedDate: new Date('2024-06-20'),
      items: [
        { name: 'Cleaning Supplies', quantity: 100, price: 8.50, expectedQuantity: 100 },
        { name: 'Paper Towels', quantity: 200, price: 3.25, expectedQuantity: 200 },
      ],
      deliveryLocation: 'Store #1042',
      trackingNumber: 'TRK-GS-002',
    },
    {
      orderId: 'PO-2024-003',
      vendorId: vendors[3]._id,
      vendorName: vendors[3].name,
      status: 'flagged',
      verificationStatus: 'failed',
      expectedDate: new Date('2024-06-10'),
      deliveryDate: new Date('2024-06-12'),
      fraudFlag: true,
      items: [
        { name: 'Frozen Foods', quantity: 30, price: 45.00, expectedQuantity: 50, condition: 'damaged' },
      ],
      deliveryLocation: 'Distribution Center B',
      trackingNumber: 'TRK-PC-003',
      notes: 'Quantity mismatch - Expected: 50 units, Delivered: 30 units. Items show signs of damage.',
    },
    {
      orderId: 'PO-2024-004',
      vendorId: vendors[2]._id,
      vendorName: vendors[2].name,
      status: 'delivered',
      verificationStatus: 'pending',
      expectedDate: new Date('2024-06-18'),
      deliveryDate: new Date('2024-06-17'),
      items: [
        { name: 'Shipping Boxes (Large)', quantity: 500, price: 2.50, expectedQuantity: 500, condition: 'good' },
      ],
      deliveryLocation: 'Warehouse C',
      trackingNumber: 'TRK-SL-004',
    },
    {
      orderId: 'PO-2024-005',
      vendorId: vendors[4]._id,
      vendorName: vendors[4].name,
      status: 'verified',
      verificationStatus: 'verified',
      expectedDate: new Date('2024-06-14'),
      deliveryDate: new Date('2024-06-14'),
      items: [
        { name: 'Solar Panels', quantity: 20, price: 350.00, expectedQuantity: 20, condition: 'good' },
      ],
      deliveryLocation: 'Store #2108',
      trackingNumber: 'TRK-GE-005',
    },
  ]);
  console.log(`✅ Created ${deliveries.length} deliveries`);

  // Create compliance logs
  const logs = await ComplianceLog.create([
    { vendorId: vendors[0]._id, type: 'audit', title: 'Annual Compliance Audit', description: 'Annual compliance audit passed', severity: 'low', status: 'closed' },
    { vendorId: vendors[1]._id, type: 'inspection', title: 'Routine Inspection', description: 'Routine inspection completed', severity: 'low', status: 'closed' },
    { vendorId: vendors[3]._id, type: 'violation', title: 'Delivery Quantity Mismatch', description: 'Delivery quantity mismatch detected', severity: 'high', status: 'open' },
    { vendorId: vendors[3]._id, type: 'violation', title: 'Quality Standards Violation', description: 'Quality standards not met - damaged goods', severity: 'critical', status: 'open' },
    { vendorId: vendors[7]._id, type: 'score_update', title: 'Compliance Score Reduced', description: 'Compliance score reduced due to inactivity', severity: 'medium', status: 'resolved' },
    { vendorId: vendors[4]._id, type: 'certification', title: 'ISO 14001 Verified', description: 'ISO 14001 certification verified', severity: 'low', status: 'closed' },
  ]);
  console.log(`✅ Created ${logs.length} compliance logs`);

  // Create purchase orders
  const orders = await PurchaseOrder.create([
    {
      poNumber: 'PO-2024-001',
      vendorId: vendors[0]._id,
      vendorName: vendors[0].name,
      items: [{ name: 'Laptop Computers', quantity: 10, unitPrice: 999.99, totalPrice: 9999.90 }],
      status: 'completed',
      totalAmount: 9999.90,
    },
    {
      poNumber: 'PO-2024-002',
      vendorId: vendors[1]._id,
      vendorName: vendors[1].name,
      items: [
        { name: 'Cleaning Supplies', quantity: 100, unitPrice: 8.50, totalPrice: 850.00 },
        { name: 'Paper Towels', quantity: 200, unitPrice: 3.25, totalPrice: 650.00 },
      ],
      status: 'approved',
      totalAmount: 1500.00,
    },
    {
      poNumber: 'PO-2024-004',
      vendorId: vendors[2]._id,
      vendorName: vendors[2].name,
      items: [{ name: 'Shipping Boxes (Large)', quantity: 500, unitPrice: 2.50, totalPrice: 1250.00 }],
      status: 'shipped',
      totalAmount: 1250.00,
    },
  ]);
  console.log(`✅ Created ${orders.length} purchase orders`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Test accounts:');
  console.log('  Admin:     admin@walmart.com / Admin123!');
  console.log('  Manager:   john@walmart.com / Manager123!');
  console.log('  Inspector: jane@walmart.com / Inspector123!');
  console.log('  Viewer:    viewer@walmart.com / Viewer123!');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
