
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  uploadImage: async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'imagegen-memes',
        use_filename: true,
        unique_filename: true
      });

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return {
        success: false,
        error: 'Failed to upload image to Cloudinary'
      };
    }
  },

  uploadAvatar: async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'imagegen-avatars',
        use_filename: true,
        unique_filename: true,
        transformation: [
          { width: 250, height: 250, crop: "fill", gravity: "face" }
        ]
      });

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Error uploading avatar to Cloudinary:', error);
      return {
        success: false,
        error: 'Failed to upload avatar to Cloudinary'
      };
    }
  },

  deleteImage: async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return {
        success: false,
        error: 'Failed to delete image from Cloudinary'
      };
    }
  }
};
