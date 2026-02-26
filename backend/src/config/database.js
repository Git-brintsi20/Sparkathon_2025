
const mongoose = require('mongoose');

// Serverless-friendly connection caching (Vercel warm containers reuse this)
let cached = global._mongooseCache;
if (!cached) {
	cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
	if (cached.conn && mongoose.connection.readyState === 1) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vendor-compliance')
			.then((conn) => {
				console.log(`MongoDB Connected: ${conn.connection.host}`);
				return conn;
			});
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (error) {
		cached.promise = null;
		console.error(`Error connecting to MongoDB: ${error.message}`);
		// In serverless, don't exit process — throw so request fails gracefully
		if (process.env.VERCEL) {
			throw error;
		}
		process.exit(1);
	}
};

module.exports = connectDB;
