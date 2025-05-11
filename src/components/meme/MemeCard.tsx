
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
import { toast } from "sonner";

interface MemeCardProps {
  meme: Meme;
  onDelete?: () => void;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  const { voteMeme } = useMemes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [currentVotes, setCurrentVotes] = useState({
    upvotes: meme.upvotes,
    downvotes: meme.downvotes,
    userVote: meme.userVote
  });
  
  const isCreator = user?.id === meme.creator.id;
  
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
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
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
                <div className="absolute top-2 left-0 right-0 text-center meme-text px-4 text-2xl md:text-3xl">
                  {meme.topText}
                </div>
              )}
              
              {meme.bottomText && (
                <div className="absolute bottom-2 left-0 right-0 text-center meme-text px-4 text-2xl md:text-3xl">
                  {meme.bottomText}
                </div>
              )}
            </div>
          </Link>
        </div>
        
        <CardFooter className="flex flex-col p-4">
          <div className="flex items-center justify-between w-full">
            {/* Vote buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`text-gray-500 hover:text-green-500 ${
                  currentVotes.userVote === "up" ? "text-green-500" : ""
                }`}
                onClick={() => handleVote("up")}
                disabled={isVoting}
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
                disabled={isVoting}
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
                      <Badge variant="secondary" className="cursor-pointer">
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
    </motion.div>
  );
};

export default MemeCard;
