const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+?[\d\s()-]{7,15}$/.test(phone);
const validatePassword = (password) => password && password.length >= 6;
const validateMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

module.exports = { validateEmail, validatePhone, validatePassword, validateMongoId };
