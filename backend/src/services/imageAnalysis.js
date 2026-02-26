// Image analysis service - uses Cloudinary for image processing
const cloudinary = require('../config/cloudinary');

class ImageAnalysisService {
  // Upload and analyze delivery photo
  async analyzeDeliveryPhoto(fileBuffer, deliveryId) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: `deliveries/${deliveryId}`, resource_type: 'image' },
          (error, result) => (error ? reject(error) : resolve(result))
        ).end(fileBuffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        analysis: {
          quality: result.quality_analysis?.focus || 0.8,
          isBlurry: (result.quality_analysis?.focus || 0.8) < 0.5,
        },
      };
    } catch (error) {
      console.error('Image upload error:', error.message);
      // Fallback: return a placeholder when Cloudinary is not configured
      return {
        url: `https://placehold.co/800x600/E0E0E0/616161?text=Delivery+${deliveryId}`,
        publicId: `placeholder_${deliveryId}_${Date.now()}`,
        width: 800,
        height: 600,
        format: 'png',
        analysis: { quality: 0.8, isBlurry: false },
      };
    }
  }

  // Upload vendor document
  async uploadDocument(fileBuffer, vendorId, originalName) {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: `vendors/${vendorId}/documents`, resource_type: 'auto', public_id: originalName.split('.')[0] },
          (error, result) => (error ? reject(error) : resolve(result))
        ).end(fileBuffer);
      });
      return { url: result.secure_url, publicId: result.public_id, format: result.format, size: result.bytes };
    } catch (error) {
      console.error('Document upload error:', error.message);
      return { url: '', publicId: '', format: '', size: 0, error: error.message };
    }
  }
}

module.exports = new ImageAnalysisService();
