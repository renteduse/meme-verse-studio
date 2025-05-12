
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMemes, Meme } from "@/hooks/useMemes";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Eye, Flag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import Comments from "@/components/meme/Comments";
import AnimatedVoteButton from "@/components/meme/AnimatedVoteButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const MemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemeById, voteMeme, flagMeme } = useMemes();
  const { isAuthenticated } = useAuth();
  
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [isFlagging, setIsFlagging] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchMeme();
    }
  }, [id]);
  
  const fetchMeme = async () => {
    try {
      const memeData = await getMemeById(id as string);
      
      if (!memeData) {
        toast.error("Meme not found");
        navigate("/feed");
        return;
      }
      
      setMeme(memeData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load meme");
      navigate("/feed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVote = async (voteType: "up" | "down" | null) => {
    if (!meme) return;
    
    if (!isAuthenticated) {
      toast.error("You need to be logged in to vote");
      return;
    }
    
    // Already voted, want to remove vote
    if (meme.userVote === voteType) {
      voteType = null;
    }
    
    const success = await voteMeme(meme.id, voteType);
    
    if (success) {
      // Update local meme data with new vote counts (the hook already updates state)
      fetchMeme();
    }
  };
  
  const handleFlag = async () => {
    if (!meme) return;
    
    if (!isAuthenticated) {
      toast.error("You need to be logged in to flag content");
      return;
    }
    
    if (!flagReason.trim()) {
      toast.error("Please provide a reason for flagging");
      return;
    }
    
    setIsFlagging(true);
    
    try {
      const success = await flagMeme(meme.id, flagReason);
      
      if (success) {
        setFlagDialogOpen(false);
        setFlagReason("");
        toast.success("Content has been flagged for review");
        fetchMeme();
      }
    } catch (error) {
      console.error('Error flagging meme:', error);
    } finally {
      setIsFlagging(false);
    }
  };
  
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
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Meme Not Found</h1>
            <p className="mb-8">This meme doesn't exist or has been deleted</p>
            <Button asChild>
              <Link to="/feed">Back to Feed</Link>
            </Button>
          </div>
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
        >
          <Card>
            <CardContent className="p-0">
              {/* Creator Info */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={meme.creator.avatar} />
                    <AvatarFallback>{meme.creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <Link 
                      to={`/user/${meme.creator.id}`} 
                      className="font-medium hover:underline"
                    >
                      {meme.creator.username}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {format(new Date(meme.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                {meme.isFlagged && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900/30 dark:text-red-300">
                    Flagged
                  </span>
                )}
              </div>
              
              {/* Meme Image with Text */}
              <div className="relative">
                <img
                  src={meme.imageUrl}
                  alt={`${meme.topText} ${meme.bottomText}`}
                  className="w-full"
                />
                
                {meme.topText && (
                  <div 
                    className="absolute top-2 left-0 right-0 text-center meme-text px-4"
                    style={{ 
                      fontSize: `${meme.fontSize || 40}px`,
                      color: meme.fontColor || '#FFFFFF',
                      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
                    }}
                  >
                    {meme.topText}
                  </div>
                )}
                
                {meme.bottomText && (
                  <div 
                    className="absolute bottom-2 left-0 right-0 text-center meme-text px-4"
                    style={{ 
                      fontSize: `${meme.fontSize || 40}px`,
                      color: meme.fontColor || '#FFFFFF',
                      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
                    }}
                  >
                    {meme.bottomText}
                  </div>
                )}
              </div>
              
              {/* Actions & Stats */}
              <div className="p-4">
                {/* Voting & Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AnimatedVoteButton 
                      type="up" 
                      count={meme.upvotes} 
                      active={meme.userVote === 'up'} 
                      onClick={() => handleVote('up')}
                    />
                    <AnimatedVoteButton 
                      type="down" 
                      count={meme.downvotes} 
                      active={meme.userVote === 'down'} 
                      onClick={() => handleVote('down')}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{meme.commentCount}</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{meme.views}</span>
                    </div>
                    
                    <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
                      <DialogTrigger asChild>
                        <div>
                          <AnimatedVoteButton
                            type="flag"
                            onClick={() => {
                              if (isAuthenticated) {
                                setFlagDialogOpen(true);
                              } else {
                                toast.error("You need to be logged in to flag content");
                              }
                            }}
                            flagged={meme.isFlagged}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Content</DialogTitle>
                          <DialogDescription>
                            Please explain why you're flagging this meme. This will help our moderators review the content.
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea 
                          value={flagReason}
                          onChange={(e) => setFlagReason(e.target.value)}
                          placeholder="Reason for flagging..."
                          className="min-h-[100px]"
                        />
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleFlag} 
                            disabled={isFlagging || !flagReason.trim()}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isFlagging ? "Submitting..." : "Submit Report"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                {/* Tags */}
                {meme.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {meme.tags.map((tag) => (
                      <div key={tag} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                        #{tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Comments Section */}
              <AnimatePresence>
                {showComments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Separator />
                    <div className="p-4">
                      <Comments memeId={meme.id} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default MemeDetail;
