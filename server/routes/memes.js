
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Meme = require('../models/Meme');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// Get all memes with pagination and sorting
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'new', time = 'all' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Build query based on time filter
    let timeFilter = {};
    const now = new Date();
    if (time === '24h') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      timeFilter = { createdAt: { $gte: yesterday } };
    } else if (time === 'week') {
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      timeFilter = { createdAt: { $gte: lastWeek } };
    }
    
    // Sort options
    let sortOption = {};
    if (sort === 'new') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'top') {
      sortOption = { upvotes: -1 };
    }
    
    const memes = await Meme.find({ ...timeFilter, isDraft: false })
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Meme.countDocuments({ ...timeFilter, isDraft: false });
    
    res.status(200).json({
      success: true,
      memes,
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single meme by ID
router.get('/:id', async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ success: false, message: 'Meme not found' });
    }
    
    // Increment view count
    meme.views += 1;
    await meme.save();
    
    res.status(200).json({ success: true, meme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new meme
router.post('/', auth, async (req, res) => {
  try {
    const { topText, bottomText, tags, fontSize, fontColor, isDraft } = req.body;
    
    // Check if image was uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }
    
    const image = req.files.image;
    
    // Check file type
    if (!image.mimetype.startsWith('image')) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    
    // Check file size
    if (image.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image size should be less than 5MB' });
    }
    
    // Upload to Cloudinary
    const cloudinaryUpload = await uploadImage(image.tempFilePath);
    
    if (!cloudinaryUpload.success) {
      return res.status(500).json({ success: false, message: 'Failed to upload image' });
    }
    
    // Create meme
    const meme = await Meme.create({
      imageUrl: cloudinaryUpload.url,
      cloudinaryId: cloudinaryUpload.public_id,
      topText: topText || '',
      bottomText: bottomText || '',
      creator: {
        id: req.user.userId,
        username: req.user.username
      },
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fontSize: fontSize || 40,
      fontColor: fontColor || '#FFFFFF',
      isDraft: isDraft === 'true'
    });
    
    res.status(201).json({ success: true, meme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a meme
router.patch('/:id', auth, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ success: false, message: 'Meme not found' });
    }
    
    // Check if user is the creator
    if (meme.creator.id.toString() !== req.user.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this meme' });
    }
    
    const { topText, bottomText, tags, fontSize, fontColor, isDraft } = req.body;
    
    // Update meme
    meme.topText = topText !== undefined ? topText : meme.topText;
    meme.bottomText = bottomText !== undefined ? bottomText : meme.bottomText;
    meme.fontSize = fontSize || meme.fontSize;
    meme.fontColor = fontColor || meme.fontColor;
    meme.isDraft = isDraft !== undefined ? isDraft === 'true' : meme.isDraft;
    
    if (tags) {
      meme.tags = tags.split(',').map(tag => tag.trim());
    }
    
    await meme.save();
    
    res.status(200).json({ success: true, meme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a meme
router.delete('/:id', auth, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ success: false, message: 'Meme not found' });
    }
    
    // Check if user is the creator
    if (meme.creator.id.toString() !== req.user.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this meme' });
    }
    
    // Delete the image from Cloudinary if it exists
    if (meme.cloudinaryId) {
      await deleteImage(meme.cloudinaryId);
    }
    
    // Delete related comments
    await Comment.deleteMany({ memeId: meme._id });
    
    // Delete the meme
    await Meme.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, message: 'Meme deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Vote on a meme
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ success: false, message: 'Invalid vote type' });
    }
    
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ success: false, message: 'Meme not found' });
    }
    
    // Check if user already voted
    const existingVote = meme.votes.find(vote => vote.user.toString() === req.user.userId);
    
    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType === voteType) {
        // Remove vote if same type (toggle off)
        meme.votes = meme.votes.filter(vote => vote.user.toString() !== req.user.userId);
        if (voteType === 'up') {
          meme.upvotes -= 1;
        } else {
          meme.downvotes -= 1;
        }
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        if (voteType === 'up') {
          meme.upvotes += 1;
          meme.downvotes -= 1;
        } else {
          meme.downvotes += 1;
          meme.upvotes -= 1;
        }
      }
    } else {
      // Add new vote
      meme.votes.push({ user: req.user.userId, voteType });
      if (voteType === 'up') {
        meme.upvotes += 1;
      } else {
        meme.downvotes += 1;
      }
    }
    
    await meme.save();
    
    res.status(200).json({ 
      success: true, 
      upvotes: meme.upvotes, 
      downvotes: meme.downvotes,
      userVote: existingVote && existingVote.voteType === voteType ? null : voteType
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's memes
router.get('/user/mymemes', auth, async (req, res) => {
  try {
    const memes = await Meme.find({ 'creator.id': req.user.userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, memes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get trending memes
router.get('/trending/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const memes = await Meme.find({
      createdAt: { $gte: today },
      isDraft: false
    })
      .sort({ upvotes: -1, downvotes: 1 })
      .limit(10);
    
    res.status(200).json({ success: true, memes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
