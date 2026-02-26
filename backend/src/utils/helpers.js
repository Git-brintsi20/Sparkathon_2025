const crypto = require('crypto');

const generateRandomToken = (length = 32) => crypto.randomBytes(length).toString('hex');

const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildSortObject = (sortBy, sortOrder) => {
  if (!sortBy) return { createdAt: -1 };
  return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
};

const buildPaginatedResponse = (data, total, page, limit) => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrevious: page > 1,
});

const calculateComplianceScore = (vendor) => {
  let score = 70; // Base score
  if (vendor.totalDeliveries > 0) {
    const successRate = (vendor.successfulDeliveries / vendor.totalDeliveries) * 100;
    score = Math.round(successRate * 0.8 + 20); // 80% weight on success rate + 20 base
  }
  return Math.min(100, Math.max(0, score));
};

const getRiskLevel = (complianceScore) => {
  if (complianceScore >= 80) return 'low';
  if (complianceScore >= 60) return 'medium';
  return 'high';
};

module.exports = { generateRandomToken, parsePaginationParams, buildSortObject, buildPaginatedResponse, calculateComplianceScore, getRiskLevel };
