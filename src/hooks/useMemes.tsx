
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Meme {
  id: string;
  imageUrl: string;
  topText: string;
  bottomText: string;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  commentCount: number;
  views: number;
  tags: string[];
}

// Mock data
const MOCK_MEMES: Meme[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    topText: "WHEN YOUR CODE WORKS",
    bottomText: "BUT YOU DON'T KNOW WHY",
    creator: {
      id: "user1",
      username: "debuggod",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotes: 423,
    downvotes: 21,
    commentCount: 18,
    views: 1247,
    tags: ["javascript", "programming"]
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    topText: "THAT MOMENT",
    bottomText: "WHEN THE BUG FIXES ITSELF",
    creator: {
      id: "user2",
      username: "codewizard",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    upvotes: 331,
    downvotes: 12,
    commentCount: 24,
    views: 982,
    tags: ["bug", "webdev"]
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    topText: "DEBUGGING",
    bottomText: "THE MATRIX",
    creator: {
      id: "user3",
      username: "hackerx",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    upvotes: 512,
    downvotes: 34,
    commentCount: 32,
    views: 1568,
    tags: ["matrix", "debugging"]
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    topText: "INDENT YOUR CODE",
    bottomText: "OR REGRET IT LATER",
    creator: {
      id: "user4",
      username: "syntaxerror",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    upvotes: 267,
    downvotes: 18,
    commentCount: 12,
    views: 723,
    tags: ["syntax", "bestpractices"]
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    topText: "WRITING CLEAN CODE",
    bottomText: "VS MAKING IT WORK",
    creator: {
      id: "user5",
      username: "codecrafter",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    upvotes: 185,
    downvotes: 9,
    commentCount: 8,
    views: 562,
    tags: ["cleancode", "coding"]
  }
];

export const useMemes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch memes
    const fetchMemes = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setMemes(MOCK_MEMES);
        setLoading(false);
      } catch (err) {
        setError("Failed to load memes");
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  const getMemeById = (id: string): Meme | undefined => {
    return memes.find(meme => meme.id === id);
  };

  const createMeme = async (memeData: { 
    imageUrl: string; 
    topText: string; 
    bottomText: string; 
    userId: string;
    username: string;
    userAvatar?: string;
    tags: string[];
  }) => {
    try {
      // Simulate API call to create a meme
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newMeme: Meme = {
        id: Date.now().toString(),
        imageUrl: memeData.imageUrl,
        topText: memeData.topText,
        bottomText: memeData.bottomText,
        creator: {
          id: memeData.userId,
          username: memeData.username,
          avatar: memeData.userAvatar
        },
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        views: 0,
        tags: memeData.tags
      };

      setMemes(prevMemes => [newMeme, ...prevMemes]);
      toast.success("Meme created successfully!");
      return newMeme;
    } catch (err) {
      toast.error("Failed to create meme");
      throw new Error("Failed to create meme");
    }
  };

  const voteMeme = async (memeId: string, voteType: "up" | "down" | null) => {
    try {
      // Simulate API call to vote on a meme
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMemes(prevMemes => 
        prevMemes.map(meme => {
          if (meme.id === memeId) {
            const previousVote = meme.userVote;
            
            // Calculate new vote counts
            let newUpvotes = meme.upvotes;
            let newDownvotes = meme.downvotes;
            
            // Remove previous vote if it exists
            if (previousVote === "up") {
              newUpvotes -= 1;
            } else if (previousVote === "down") {
              newDownvotes -= 1;
            }
            
            // Add new vote
            if (voteType === "up") {
              newUpvotes += 1;
            } else if (voteType === "down") {
              newDownvotes += 1;
            }
            
            return {
              ...meme,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVote: voteType
            };
          }
          return meme;
        })
      );
      
      return true;
    } catch (err) {
      toast.error("Failed to vote on meme");
      return false;
    }
  };

  const deleteMeme = async (memeId: string) => {
    try {
      // Simulate API call to delete a meme
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMemes(prevMemes => prevMemes.filter(meme => meme.id !== memeId));
      toast.success("Meme deleted successfully");
      return true;
    } catch (err) {
      toast.error("Failed to delete meme");
      return false;
    }
  };

  return {
    memes,
    loading,
    error,
    getMemeById,
    createMeme,
    voteMeme,
    deleteMeme,
  };
};
