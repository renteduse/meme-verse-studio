
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Meme = require('../models/Meme');
const auth = require('../middleware/auth');

// Get comments for a meme
router.get('/meme/:memeId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const comments = await Comment.find({ memeId: req.params.memeId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Comment.countDocuments({ memeId: req.params.memeId });
    
    res.status(200).json({
      success: true,
      comments,
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a comment to a meme
router.post('/', auth, async (req, res) => {
  try {
    const { memeId, text } = req.body;
    
    if (!text || text.length > 140) {
      return res.status(400).json({ 
        success: false, 
        message: text ? 'Comment must be 140 characters or less' : 'Comment cannot be empty' 
      });
    }
    
    // Check if meme exists
    const meme = await Meme.findById(memeId);
    if (!meme) {
      return res.status(404).json({ success: false, message: 'Meme not found' });
    }
    
    // Create comment
    const comment = await Comment.create({
      memeId,
      text,
      user: {
        id: req.user.userId,
        username: req.user.username,
        avatar: req.body.userAvatar || ''
      }
    });
    
    // Update comment count
    meme.commentCount += 1;
    await meme.save();
    
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    
    // Check if user is the comment creator
    if (comment.user.id.toString() !== req.user.userId) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this comment' });
    }
    
    // Delete comment
    await Comment.findByIdAndDelete(req.params.id);
    
    // Update comment count
    const meme = await Meme.findById(comment.memeId);
    if (meme) {
      meme.commentCount = Math.max(0, meme.commentCount - 1);
      await meme.save();
    }
    
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
