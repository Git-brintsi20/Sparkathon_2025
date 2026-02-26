module.exports = {
  ROLES: { ADMIN: 'admin', MANAGER: 'manager', INSPECTOR: 'inspector', VIEWER: 'viewer' },
  VENDOR_STATUS: { ACTIVE: 'active', INACTIVE: 'inactive', PENDING: 'pending', SUSPENDED: 'suspended' },
  DELIVERY_STATUS: { PENDING: 'pending', IN_TRANSIT: 'in_transit', DELIVERED: 'delivered', VERIFIED: 'verified', REJECTED: 'rejected', FLAGGED: 'flagged' },
  COMPLIANCE_TYPES: { AUDIT: 'audit', VIOLATION: 'violation', CERTIFICATION: 'certification', INSPECTION: 'inspection', REMEDIATION: 'remediation', SCORE_UPDATE: 'score_update' },
  RISK_LEVELS: { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' },
  PO_STATUS: { DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved', SHIPPED: 'shipped', DELIVERED: 'delivered', COMPLETED: 'completed', CANCELLED: 'cancelled' },
  PAGINATION: { DEFAULT_PAGE: 1, DEFAULT_LIMIT: 10, MAX_LIMIT: 100 },
};
