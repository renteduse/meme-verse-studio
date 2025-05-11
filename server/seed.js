
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Meme = require('./models/Meme');
const Comment = require('./models/Comment');

const sampleMemes = [
  {
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    topText: "WHEN YOUR CODE WORKS",
    bottomText: "BUT YOU DON'T KNOW WHY",
    creator: {
      username: "debuggod"
    },
    upvotes: 423,
    downvotes: 21,
    commentCount: 18,
    views: 1247,
    tags: ["javascript", "programming"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    topText: "THAT MOMENT",
    bottomText: "WHEN THE BUG FIXES ITSELF",
    creator: {
      username: "codewizard"
    },
    upvotes: 331,
    downvotes: 12,
    commentCount: 24,
    views: 982,
    tags: ["bug", "webdev"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    topText: "DEBUGGING",
    bottomText: "THE MATRIX",
    creator: {
      username: "hackerx"
    },
    upvotes: 512,
    downvotes: 34,
    commentCount: 32,
    views: 1568,
    tags: ["matrix", "debugging"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    topText: "INDENT YOUR CODE",
    bottomText: "OR REGRET IT LATER",
    creator: {
      username: "syntaxerror"
    },
    upvotes: 267,
    downvotes: 18,
    commentCount: 12,
    views: 723,
    tags: ["syntax", "bestpractices"]
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    topText: "WRITING CLEAN CODE",
    bottomText: "VS MAKING IT WORK",
    creator: {
      username: "codecrafter"
    },
    upvotes: 185,
    downvotes: 9,
    commentCount: 8,
    views: 562,
    tags: ["cleancode", "coding"]
  }
];

const sampleUsers = [
  {
    username: "debuggod",
    email: "debuggod@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    username: "codewizard",
    email: "codewizard@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    username: "hackerx",
    email: "hackerx@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    username: "syntaxerror",
    email: "syntaxerror@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    username: "codecrafter",
    email: "codecrafter@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

const commentTexts = [
  "This is hilarious! 😂",
  "I feel personally attacked by this meme",
  "As a developer, I can confirm this is 100% accurate",
  "Send this to your non-technical friends and watch their confusion",
  "I'm in this picture and I don't like it",
  "This is the story of my life!",
  "Saving this one for later 📌",
  "My daily struggle",
  "This deserves more upvotes",
  "Quality content right here"
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Meme.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');
    
    // Create users
    const users = await User.create(sampleUsers);
    console.log('Created sample users');
    
    // Create memes
    const memes = await Promise.all(
      sampleMemes.map(async (meme, index) => {
        const user = users[index % users.length];
        return await Meme.create({
          ...meme,
          creator: {
            id: user._id,
            username: user.username,
            avatar: user.avatar
          }
        });
      })
    );
    console.log('Created sample memes');
    
    // Create comments
    const comments = [];
    for (const meme of memes) {
      const commentCount = Math.floor(Math.random() * 10) + 5;
      for (let i = 0; i < commentCount; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const text = commentTexts[Math.floor(Math.random() * commentTexts.length)];
        comments.push({
          memeId: meme._id,
          text,
          user: {
            id: user._id,
            username: user.username,
            avatar: user.avatar
          }
        });
      }
    }
    
    await Comment.create(comments);
    console.log('Created sample comments');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
