
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  memeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meme',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 140
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
