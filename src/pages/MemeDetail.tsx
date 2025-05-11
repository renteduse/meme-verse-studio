
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useMemes, Meme } from "@/hooks/useMemes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

const MemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { memes, loading, error, voteMeme, deleteMeme } = useMemes();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [meme, setMeme] = useState<Meme | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentVotes, setCurrentVotes] = useState({
    upvotes: 0,
    downvotes: 0,
    userVote: null as "up" | "down" | null
  });
  
  useEffect(() => {
    if (memes.length && id) {
      const foundMeme = memes.find(m => m.id === id);
      if (foundMeme) {
        setMeme(foundMeme);
        setCurrentVotes({
          upvotes: foundMeme.upvotes,
          downvotes: foundMeme.downvotes,
          userVote: foundMeme.userVote
        });
        
        // Generate mock comments
        generateMockComments(foundMeme);
      }
    }
  }, [memes, id]);
  
  const generateMockComments = (meme: Meme) => {
    const mockComments: Comment[] = [];
    
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
    
    const usernames = [
      "codewizard",
      "debuggod",
      "stackoverflowner",
      "gitcommit",
      "semicolonfighter",
      "jsmaster",
      "cssmagician",
      "reactninja",
      "pythonista",
      "devops_guru"
    ];
    
    for (let i = 0; i < Math.min(meme.commentCount, 5); i++) {
      mockComments.push({
        id: `comment-${i}-${meme.id}`,
        text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
        user: {
          id: `user-${i}`,
          username: usernames[Math.floor(Math.random() * usernames.length)],
          avatar: `https://i.pravatar.cc/150?img=${i + 10}`
        }
      });
    }
    
    // Sort by newest first
    mockComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setComments(mockComments);
  };
  
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user && meme) {
        const newCommentObj: Comment = {
          id: `comment-new-${Date.now()}`,
          text: newComment,
          createdAt: new Date().toISOString(),
          user: {
            id: user.id,
            username: user.username,
            avatar: user.avatar
          }
        };
        
        // Update comments
        setComments([newCommentObj, ...comments]);
        
        // Update meme comment count
        if (meme) {
          setMeme({
            ...meme,
            commentCount: meme.commentCount + 1
          });
        }
        
        setNewComment("");
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
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
  
  if (error || !meme) {
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
                  <div className="absolute top-4 left-0 right-0 text-center meme-text px-4 text-2xl md:text-4xl">
                    {meme.topText}
                  </div>
                )}
                
                {meme.bottomText && (
                  <div className="absolute bottom-4 left-0 right-0 text-center meme-text px-4 text-2xl md:text-4xl">
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
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-gray-500 hover:text-green-500 ${
                        currentVotes.userVote === "up" ? "text-green-500" : ""
                      }`}
                      onClick={() => handleVote("up")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      <span>{currentVotes.upvotes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-gray-500 hover:text-red-500 ${
                        currentVotes.userVote === "down" ? "text-red-500" : ""
                      }`}
                      onClick={() => handleVote("down")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <span>{currentVotes.downvotes}</span>
                    </Button>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>{meme.commentCount}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
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
                      <div className="flex items-center">
                        <Link to={`/user/${comment.user.id}`} className="font-medium text-sm mr-2 hover:underline">
                          {comment.user.username}
                        </Link>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
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
