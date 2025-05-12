
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMemes, Comment } from "@/hooks/useMemes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CommentsProps {
  memeId: string;
}

const Comments = ({ memeId }: CommentsProps) => {
  const { user, isAuthenticated } = useAuth();
  const { getComments, addComment, deleteComment } = useMemes();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [memeId]);
  
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const result = await getComments(memeId);
      setComments(result.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const newComment = await addComment(memeId, commentText.trim());
      
      if (newComment) {
        setComments(prev => [newComment, ...prev]);
        setCommentText("");
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (commentId: string) => {
    try {
      const success = await deleteComment(commentId, memeId);
      
      if (success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        toast.success("Comment deleted");
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      
      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="submit" 
                disabled={isSubmitting || !commentText.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-500"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                    Posting...
                  </>
                ) : 'Post Comment'}
              </Button>
            </motion.div>
          </div>
        </form>
      ) : (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-center">
            <a href="/login" className="text-primary font-medium">Sign in</a> to leave a comment
          </p>
        </div>
      )}
      
      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AnimatePresence>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-4 pb-4 border-b"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{comment.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{comment.user.username}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), "MMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                      
                      {user?.id === comment.user.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 px-2"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Comments;
