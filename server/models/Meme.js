
const mongoose = require('mongoose');

const MemeSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  topText: {
    type: String,
    default: ''
  },
  bottomText: {
    type: String,
    default: ''
  },
  creator: {
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
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    voteType: {
      type: String,
      enum: ['up', 'down']
    }
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  isDraft: {
    type: Boolean,
    default: false
  },
  fontSize: {
    type: Number,
    default: 40
  },
  fontColor: {
    type: String,
    default: '#FFFFFF'
  }
});

module.exports = mongoose.model('Meme', MemeSchema);
