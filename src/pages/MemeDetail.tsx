
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useMemes, Meme, Comment } from "@/hooks/useMemes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ThumbsUp, ThumbsDown, Flag, MessageSquare, Eye, Trash2 } from "lucide-react";

const MemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getMemeById, voteMeme, deleteMeme, getComments, addComment, deleteComment } = useMemes();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [meme, setMeme] = useState<Meme | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentVotes, setCurrentVotes] = useState({
    upvotes: 0,
    downvotes: 0,
    userVote: null as "up" | "down" | null
  });
  
  useEffect(() => {
    if (id) {
      fetchMeme();
    }
  }, [id]);
  
  const fetchMeme = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const memeData = await getMemeById(id);
      if (memeData) {
        setMeme(memeData);
        setCurrentVotes({
          upvotes: memeData.upvotes,
          downvotes: memeData.downvotes,
          userVote: memeData.userVote
        });
        fetchComments();
      }
    } catch (error) {
      console.error('Error fetching meme:', error);
      toast.error("Failed to load meme");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchComments = async () => {
    if (!id) return;
    
    try {
      const result = await getComments(id, { page: commentPage });
      setComments(prev => commentPage === 1 ? result.comments : [...prev, ...result.comments]);
      setTotalComments(result.total);
      setHasMoreComments(commentPage < result.pages);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  const loadMoreComments = () => {
    setCommentPage(prev => prev + 1);
  };
  
  useEffect(() => {
    if (id && commentPage > 1) {
      fetchComments();
    }
  }, [commentPage]);
  
  const handleVote = async (voteType: "up" | "down" | null) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    if (!meme) return;
    
    // If user clicks on the same vote button, remove the vote
    const newVoteType = currentVotes.userVote === voteType ? null : voteType;
    
    try {
      // Optimistically update UI
      updateLocalVotes(newVoteType);
      
      // Make API call
      await voteMeme(meme.id, newVoteType);
    } catch (error) {
      // Revert on error
      updateLocalVotes(currentVotes.userVote);
      toast.error("Failed to register vote");
    }
  };
  
  const updateLocalVotes = (newVoteType: "up" | "down" | null) => {
    const oldVoteType = currentVotes.userVote;
    
    let newUpvotes = currentVotes.upvotes;
    let newDownvotes = currentVotes.downvotes;
    
    // Remove previous vote if it exists
    if (oldVoteType === "up") {
      newUpvotes -= 1;
    } else if (oldVoteType === "down") {
      newDownvotes -= 1;
    }
    
    // Add new vote
    if (newVoteType === "up") {
      newUpvotes += 1;
    } else if (newVoteType === "down") {
      newDownvotes += 1;
    }
    
    setCurrentVotes({
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      userVote: newVoteType
    });
  };
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to comment");
      return;
    }
    
    if (!meme) return;
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    if (newComment.length > 140) {
      toast.error("Comment must be 140 characters or less");
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      const comment = await addComment(meme.id, newComment);
      
      if (comment) {
        setComments([comment, ...comments]);
        setTotalComments(prev => prev + 1);
        
        // Update meme comment count
        setMeme({
          ...meme,
          commentCount: meme.commentCount + 1
        });
        
        setNewComment("");
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (!meme) return;
    
    setIsDeletingComment(commentId);
    
    try {
      const success = await deleteComment(commentId, meme.id);
      
      if (success) {
        setComments(comments.filter(c => c.id !== commentId));
        setTotalComments(prev => prev - 1);
        toast.success("Comment deleted");
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsDeletingComment(null);
    }
  };
  
  const handleDeleteMeme = async () => {
    if (!meme) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteMeme(meme.id);
      if (success) {
        toast.success("Meme deleted successfully");
        navigate("/dashboard");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete meme");
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy • h:mm a");
  };
  
  const isCreator = user && meme && user.id === meme.creator.id;

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!meme) {
    return (
      <MainLayout>
        <div className="container max-w-4xl px-4 py-20">
          <Card className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Meme Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The meme you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link to="/feed">Back to Feed</Link>
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Breadcrumb */}
          <nav className="text-sm breadcrumbs">
            <ul className="flex space-x-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/feed" className="text-gray-500 hover:text-primary">Feed</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900 dark:text-gray-200">Meme</span>
              </li>
            </ul>
          </nav>
          
          {/* Meme Card */}
          <Card className="overflow-hidden shadow-lg">
            {/* Flag Banner */}
            {meme.isFlagged && (
              <div className="bg-red-500 text-white px-4 py-1 text-center text-sm font-medium">
                This meme has been flagged by the community
              </div>
            )}
            
            <CardContent className="p-0">
              {/* Creator Info */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <Link to={`/user/${meme.creator.id}`} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={meme.creator.avatar} alt={meme.creator.username} />
                    <AvatarFallback>
                      {meme.creator.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{meme.creator.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(meme.createdAt)}
                    </p>
                  </div>
                </Link>
                
                {isCreator && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/edit/${meme.id}`}>Edit</Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setShowDeleteAlert(true)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Meme Image */}
              <div className="relative">
                <img 
                  src={meme.imageUrl} 
                  alt="Meme" 
                  className="w-full object-contain max-h-[600px]"
                />
                
                {/* Meme text overlay */}
                {meme.topText && (
                  <div 
                    className="absolute top-4 left-0 right-0 text-center meme-text px-4 text-2xl md:text-4xl"
                    style={{ 
                      fontSize: `${meme.fontSize || 40}px`,
                      color: meme.fontColor || '#FFFFFF'
                    }}
                  >
                    {meme.topText}
                  </div>
                )}
                
                {meme.bottomText && (
                  <div 
                    className="absolute bottom-4 left-0 right-0 text-center meme-text px-4 text-2xl md:text-4xl"
                    style={{ 
                      fontSize: `${meme.fontSize || 40}px`,
                      color: meme.fontColor || '#FFFFFF'
                    }}
                  >
                    {meme.bottomText}
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* Actions and Stats */}
            <CardFooter className="p-4 border-t border-gray-100 dark:border-gray-800">
              <div className="w-full flex flex-col space-y-4">
                {/* Voting & Stats */}
                <div className="flex items-center justify-between">
                  {/* Vote buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`group relative ${
                        currentVotes.userVote === "up" ? "text-green-500" : "text-gray-500 hover:text-green-500" 
                      }`}
                      onClick={() => handleVote("up")}
                    >
                      <ThumbsUp 
                        className={`mr-1 ${currentVotes.userVote === "up" ? "fill-green-500 stroke-green-500" : "group-hover:stroke-green-500"}`} 
                        size={20}
                      />
                      <span>{currentVotes.upvotes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`group relative ${
                        currentVotes.userVote === "down" ? "text-red-500" : "text-gray-500 hover:text-red-500"
                      }`}
                      onClick={() => handleVote("down")}
                    >
                      <ThumbsDown 
                        className={`mr-1 ${currentVotes.userVote === "down" ? "fill-red-500 stroke-red-500" : "group-hover:stroke-red-500"}`} 
                        size={20}
                      />
                      <span>{currentVotes.downvotes}</span>
                    </Button>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center text-sm">
                      <MessageSquare size={18} className="mr-1" />
                      <span>{meme.commentCount}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Eye size={18} className="mr-1" />
                      <span>{meme.views}</span>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {meme.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {meme.tags.map(tag => (
                      <Link to={`/tag/${tag}`} key={tag}>
                        <Badge variant="secondary" className="cursor-pointer">
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
          
          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Comments ({meme.commentCount})</h2>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <Input
                placeholder={isAuthenticated ? "Add a comment..." : "Login to comment"}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={!isAuthenticated || isSubmittingComment}
                maxLength={140}
              />
              <Button 
                type="submit" 
                disabled={!isAuthenticated || !newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? "Posting..." : "Post"}
              </Button>
            </form>
            
            {/* Character counter */}
            {isAuthenticated && newComment && (
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                {newComment.length}/140 characters
              </div>
            )}
            
            <Separator />
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex space-x-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
                      <AvatarFallback>
                        {comment.user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Link to={`/user/${comment.user.id}`} className="font-medium text-sm mr-2 hover:underline">
                            {comment.user.username}
                          </Link>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        
                        {isAuthenticated && user?.id === comment.user.id && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={isDeletingComment === comment.id}
                          >
                            {isDeletingComment === comment.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="mt-1">{comment.text}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
              
              {hasMoreComments && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={loadMoreComments}
                  >
                    Load More Comments
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your meme from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMeme}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default MemeDetail;
