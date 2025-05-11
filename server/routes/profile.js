
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Meme = require('../models/Meme');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const { uploadAvatar, deleteImage } = require('../utils/cloudinary');

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get meme stats
    const memesCount = await Meme.countDocuments({ 'creator.id': user._id, isDraft: false });
    const draftsCount = await Meme.countDocuments({ 'creator.id': user._id, isDraft: true });
    
    const userMemes = await Meme.find({ 'creator.id': user._id, isDraft: false });
    const totalUpvotes = userMemes.reduce((sum, meme) => sum + meme.upvotes, 0);
    const totalViews = userMemes.reduce((sum, meme) => sum + meme.views, 0);
    
    res.status(200).json({
      success: true,
      profile: {
        id: user._id,
        username: user.username,
        displayName: user.displayName || user.username,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website,
        createdAt: user.createdAt
      },
      stats: {
        memesCount,
        draftsCount,
        totalUpvotes,
        totalViews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile
router.patch('/', auth, async (req, res) => {
  try {
    const { displayName, bio, location, website } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update fields
    if (displayName) user.displayName = displayName;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (website) user.website = website;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName || user.username,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload avatar
router.post('/avatar', auth, async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }
    
    const avatar = req.files.avatar;
    
    // Check file type
    if (!avatar.mimetype.startsWith('image')) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    
    // Check file size
    if (avatar.size > 2 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Avatar size should be less than 2MB' });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Delete previous avatar if exists
    if (user.avatarCloudinaryId) {
      await deleteImage(user.avatarCloudinaryId);
    }
    
    // Upload to Cloudinary
    const cloudinaryUpload = await uploadAvatar(avatar.tempFilePath);
    
    if (!cloudinaryUpload.success) {
      return res.status(500).json({ success: false, message: 'Failed to upload avatar' });
    }
    
    // Update user
    user.avatar = cloudinaryUpload.url;
    user.avatarCloudinaryId = cloudinaryUpload.public_id;
    await user.save();
    
    // Also update avatar in all memes by this user
    await Meme.updateMany(
      { 'creator.id': user._id },
      { $set: { 'creator.avatar': cloudinaryUpload.url } }
    );
    
    // And in all comments by this user
    await Comment.updateMany(
      { 'user.id': user._id },
      { $set: { 'user.avatar': cloudinaryUpload.url } }
    );
    
    res.status(200).json({
      success: true,
      avatar: cloudinaryUpload.url
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
