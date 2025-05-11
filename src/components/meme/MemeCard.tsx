
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useMemes, Meme } from "@/hooks/useMemes";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { ThumbsUp, ThumbsDown, Flag, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface MemeCardProps {
  meme: Meme;
  onDelete?: () => void;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  const { voteMeme } = useMemes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [currentVotes, setCurrentVotes] = useState({
    upvotes: meme.upvotes,
    downvotes: meme.downvotes,
    userVote: meme.userVote
  });
  const [animateUp, setAnimateUp] = useState(false);
  const [animateDown, setAnimateDown] = useState(false);
  
  const isCreator = user?.id === meme.creator.id;

  // Record view when meme card is viewed
  const recordView = async () => {
    try {
      await axios.post(`http://localhost:5000/api/memes/${meme.id}/view`);
    } catch (error) {
      // Silently fail - views are nice to have but not critical
    }
  };
  
  const handleVote = async (voteType: "up" | "down" | null) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    if (isVoting) return;
    
    // If user clicks on the same vote button, remove the vote
    const newVoteType = currentVotes.userVote === voteType ? null : voteType;
    
    setIsVoting(true);
    
    try {
      // Optimistically update UI
      updateLocalVotes(newVoteType);
      
      // Animate the vote
      if (newVoteType === "up") {
        setAnimateUp(true);
        setTimeout(() => setAnimateUp(false), 700); 
      } else if (newVoteType === "down") {
        setAnimateDown(true);
        setTimeout(() => setAnimateDown(false), 700);
      }
      
      // Make API call
      await voteMeme(meme.id, newVoteType);
    } catch (error) {
      // Revert on error
      updateLocalVotes(currentVotes.userVote);
      toast.error("Failed to register vote");
    } finally {
      setIsVoting(false);
    }
  };
  
  const handleFlagSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to flag content");
      return;
    }
    
    if (!flagReason.trim()) {
      toast.error("Please provide a reason for flagging this meme");
      return;
    }
    
    setIsFlagging(true);
    
    try {
      await axios.post(`http://localhost:5000/api/memes/${meme.id}/flag`, {
        reason: flagReason
      });
      
      toast.success("Content has been flagged for review");
      setFlagDialogOpen(false);
      setFlagReason("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to flag content");
    } finally {
      setIsFlagging(false);
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

  const getRelativeTimeString = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInDays > 7) {
      return format(date, 'MMM d');
    } else if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes}m ago`;
    } else {
      return 'just now';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onViewportEnter={recordView}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
        {/* Flag Banner */}
        {meme.isFlagged && (
          <div className="bg-red-500 text-white px-4 py-1 text-center text-sm font-medium">
            This meme has been flagged by the community
          </div>
        )}
        
        <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={meme.creator.avatar} alt={meme.creator.username} />
                <AvatarFallback>
                  {meme.creator.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link to={`/user/${meme.creator.id}`} className="font-medium text-sm hover:underline">
                  {meme.creator.username}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getRelativeTimeString(meme.createdAt)}
                </p>
              </div>
            </div>
            
            {isCreator && onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onDelete}
                className="text-gray-500 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            )}
          </div>
        </CardHeader>
        
        <div className="relative">
          <Link to={`/meme/${meme.id}`}>
            <div className="relative">
              <img 
                src={meme.imageUrl} 
                alt="Meme" 
                className="w-full object-cover"
                style={{ maxHeight: "500px" }}
              />
              
              {/* Meme text overlay */}
              {meme.topText && (
                <div 
                  className="absolute top-2 left-0 right-0 text-center meme-text px-4 text-2xl md:text-3xl"
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
                  className="absolute bottom-2 left-0 right-0 text-center meme-text px-4 text-2xl md:text-3xl"
                  style={{ 
                    fontSize: `${meme.fontSize || 40}px`,
                    color: meme.fontColor || '#FFFFFF'
                  }}
                >
                  {meme.bottomText}
                </div>
              )}
            </div>
          </Link>
        </div>
        
        <CardFooter className="flex flex-col p-4">
          <div className="flex items-center justify-between w-full">
            {/* Vote buttons with animations */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={`group relative ${
                  currentVotes.userVote === "up" ? "text-green-500" : "text-gray-500 hover:text-green-500" 
                }`}
                onClick={() => handleVote("up")}
                disabled={isVoting}
              >
                <motion.div
                  animate={animateUp ? { y: [-20, 0], opacity: [0, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-500"
                >
                  {animateUp && "+1"}
                </motion.div>
                
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
                disabled={isVoting}
              >
                <motion.div
                  animate={animateDown ? { y: [20, 0], opacity: [0, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-500"
                >
                  {animateDown && "-1"}
                </motion.div>
                
                <ThumbsDown 
                  className={`mr-1 ${currentVotes.userVote === "down" ? "fill-red-500 stroke-red-500" : "group-hover:stroke-red-500"}`} 
                  size={20}
                />
                <span>{currentVotes.downvotes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFlagDialogOpen(true)}
                className="text-gray-500 hover:text-orange-500"
              >
                <Flag size={18} className="mr-1" />
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

          <AnimatePresence>
            {(meme.tags.length > 0 || isExpanded) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-wrap gap-2">
                  {meme.tags.map(tag => (
                    <Link to={`/tag/${tag}`} key={tag}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {meme.tags.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs mt-2 self-start"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide tags" : "Show tags"}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Flag Dialog */}
      <AlertDialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag Inappropriate Content</AlertDialogTitle>
            <AlertDialogDescription>
              Please explain why you're flagging this meme. This will be reviewed by moderators.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <textarea 
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Explain why this content is inappropriate..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-right text-gray-500 mt-1">
              {flagReason.length}/200
            </p>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFlagSubmit}
              disabled={isFlagging || !flagReason.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {isFlagging ? "Submitting..." : "Submit Flag"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default MemeCard;
