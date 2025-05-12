
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// Define API URL
const API_URL = 'http://localhost:5000/api';

export interface Meme {
  id: string;
  _id: string;
  imageUrl: string;
  cloudinaryId?: string;
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
  fontSize?: number;
  fontColor?: string;
  isDraft?: boolean;
  isFlagged?: boolean;
}

export interface Comment {
  id: string;
  _id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface FetchMemesOptions {
  page?: number;
  limit?: number;
  sort?: 'new' | 'top';
  time?: 'all' | '24h' | 'week';
}

interface FetchCommentsOptions {
  page?: number;
  limit?: number;
}

export const useMemes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Format meme from API response
  const formatMeme = (meme: any): Meme => ({
    id: meme._id,
    _id: meme._id,
    imageUrl: meme.imageUrl,
    cloudinaryId: meme.cloudinaryId,
    topText: meme.topText || '',
    bottomText: meme.bottomText || '',
    creator: {
      id: meme.creator.id,
      username: meme.creator.username,
      avatar: meme.creator.avatar
    },
    createdAt: meme.createdAt,
    upvotes: meme.upvotes,
    downvotes: meme.downvotes,
    userVote: meme.userVote,
    commentCount: meme.commentCount,
    views: meme.views,
    tags: meme.tags,
    fontSize: meme.fontSize,
    fontColor: meme.fontColor,
    isDraft: meme.isDraft,
    isFlagged: meme.isFlagged
  });

  // Format comment from API response
  const formatComment = (comment: any): Comment => ({
    id: comment._id,
    _id: comment._id,
    text: comment.text,
    createdAt: comment.createdAt,
    user: {
      id: comment.user.id,
      username: comment.user.username,
      avatar: comment.user.avatar
    }
  });

  const fetchMemes = async (options: FetchMemesOptions = {}) => {
    const { page = 1, limit = 10, sort = 'new', time = 'all' } = options;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/memes`, {
        params: { page, limit, sort, time }
      });
      
      if (response.data.success) {
        const formattedMemes = response.data.memes.map(formatMeme);
        setMemes(formattedMemes);
      }
    } catch (err) {
      console.error('Error fetching memes:', err);
      setError("Failed to load memes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const getMemeById = useCallback(async (id: string): Promise<Meme | undefined> => {
    try {
      const response = await axios.get(`${API_URL}/memes/${id}`);
      
      if (response.data.success) {
        return formatMeme(response.data.meme);
      }
      return undefined;
    } catch (err) {
      console.error('Error fetching meme:', err);
      throw new Error("Failed to fetch meme");
    }
  }, []);

  const createMeme = async (memeData: { 
    imageFile: File;
    topText: string; 
    bottomText: string;
    tags: string[];
    fontSize?: number;
    fontColor?: string;
    isDraft?: boolean;
  }): Promise<Meme> => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to create a meme');
    }

    try {
      const formData = new FormData();
      formData.append('image', memeData.imageFile);
      formData.append('topText', memeData.topText);
      formData.append('bottomText', memeData.bottomText);
      formData.append('tags', memeData.tags.join(','));
      
      if (memeData.fontSize) {
        formData.append('fontSize', memeData.fontSize.toString());
      }
      
      if (memeData.fontColor) {
        formData.append('fontColor', memeData.fontColor);
      }
      
      if (memeData.isDraft !== undefined) {
        formData.append('isDraft', memeData.isDraft.toString());
      }
      
      const response = await axios.post(`${API_URL}/memes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const newMeme = formatMeme(response.data.meme);
        setMemes(prevMemes => [newMeme, ...prevMemes]);
        toast.success("Meme created successfully!");
        return newMeme;
      }
      
      throw new Error("Failed to create meme");
    } catch (err: any) {
      console.error('Error creating meme:', err);
      toast.error(err.response?.data?.message || "Failed to create meme");
      throw new Error(err.response?.data?.message || "Failed to create meme");
    }
  };

  const updateMeme = async (memeId: string, updateData: {
    topText?: string;
    bottomText?: string;
    tags?: string[];
    fontSize?: number;
    fontColor?: string;
    isDraft?: boolean;
  }): Promise<Meme> => {
    try {
      const response = await axios.patch(`${API_URL}/memes/${memeId}`, updateData);
      
      if (response.data.success) {
        const updatedMeme = formatMeme(response.data.meme);
        
        setMemes(prevMemes => 
          prevMemes.map(meme => 
            meme.id === memeId ? updatedMeme : meme
          )
        );
        
        toast.success("Meme updated successfully");
        return updatedMeme;
      }
      
      throw new Error("Failed to update meme");
    } catch (err: any) {
      console.error('Error updating meme:', err);
      toast.error(err.response?.data?.message || "Failed to update meme");
      throw new Error(err.response?.data?.message || "Failed to update meme");
    }
  };

  const voteMeme = async (memeId: string, voteType: "up" | "down" | null) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to vote");
      return false;
    }

    try {
      const response = await axios.post(`${API_URL}/memes/${memeId}/vote`, { voteType });
      
      if (response.data.success) {
        // Update meme in state with new vote counts
        setMemes(prevMemes => 
          prevMemes.map(meme => {
            if (meme.id === memeId) {
              return {
                ...meme,
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
                userVote: response.data.userVote
              };
            }
            return meme;
          })
        );
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error voting:', err);
      toast.error("Failed to register vote");
      return false;
    }
  };

  const deleteMeme = async (memeId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/memes/${memeId}`);
      
      if (response.data.success) {
        // Remove meme from state
        setMemes(prevMemes => prevMemes.filter(meme => meme.id !== memeId));
        toast.success("Meme deleted successfully");
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting meme:', err);
      toast.error("Failed to delete meme");
      return false;
    }
  };

  const getUserMemes = async () => {
    if (!isAuthenticated) {
      return [];
    }
    
    try {
      const response = await axios.get(`${API_URL}/memes/user/mymemes`);
      
      if (response.data.success) {
        return response.data.memes.map(formatMeme);
      }
      
      return [];
    } catch (err) {
      console.error('Error fetching user memes:', err);
      toast.error("Failed to load your memes");
      return [];
    }
  };

  // Get comments for a meme
  const getComments = async (memeId: string, options: FetchCommentsOptions = {}) => {
    const { page = 1, limit = 20 } = options;
    
    try {
      const response = await axios.get(`${API_URL}/comments/meme/${memeId}`, {
        params: { page, limit }
      });
      
      if (response.data.success) {
        return {
          comments: response.data.comments.map(formatComment),
          total: response.data.total,
          pages: response.data.pages
        };
      }
      
      return { comments: [], total: 0, pages: 0 };
    } catch (err) {
      console.error('Error fetching comments:', err);
      toast.error("Failed to load comments");
      return { comments: [], total: 0, pages: 0 };
    }
  };

  // Add a comment to a meme
  const addComment = async (memeId: string, text: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to comment");
      return null;
    }
    
    try {
      const response = await axios.post(`${API_URL}/comments`, {
        memeId,
        text,
        userAvatar: user?.avatar
      });
      
      if (response.data.success) {
        // Update meme comment count in state
        setMemes(prevMemes => 
          prevMemes.map(meme => {
            if (meme.id === memeId) {
              return {
                ...meme,
                commentCount: meme.commentCount + 1
              };
            }
            return meme;
          })
        );
        
        return formatComment(response.data.comment);
      }
      
      return null;
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast.error(err.response?.data?.message || "Failed to add comment");
      return null;
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string, memeId: string) => {
    if (!isAuthenticated) {
      return false;
    }
    
    try {
      const response = await axios.delete(`${API_URL}/comments/${commentId}`);
      
      if (response.data.success) {
        // Update meme comment count in state
        setMemes(prevMemes => 
          prevMemes.map(meme => {
            if (meme.id === memeId) {
              return {
                ...meme,
                commentCount: Math.max(0, meme.commentCount - 1)
              };
            }
            return meme;
          })
        );
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error("Failed to delete comment");
      return false;
    }
  };

  // Flag a meme
  const flagMeme = async (memeId: string, reason: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to flag content");
      return false;
    }
    
    try {
      const response = await axios.post(`${API_URL}/memes/${memeId}/flag`, { reason });
      
      if (response.data.success) {
        // Update meme in state
        setMemes(prevMemes => 
          prevMemes.map(meme => {
            if (meme.id === memeId) {
              return {
                ...meme,
                isFlagged: response.data.isFlagged
              };
            }
            return meme;
          })
        );
        
        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error('Error flagging meme:', err);
      toast.error(err.response?.data?.message || "Failed to flag meme");
      return false;
    }
  };

  return {
    memes,
    loading,
    error,
    fetchMemes,
    getMemeById,
    createMeme,
    updateMeme,
    voteMeme,
    deleteMeme,
    getUserMemes,
    getComments,
    addComment,
    deleteComment,
    flagMeme
  };
};
