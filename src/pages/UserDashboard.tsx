
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useMemes, Meme } from "@/hooks/useMemes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MemeCard from "@/components/meme/MemeCard";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import axios from "axios";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { loading: globalLoading, deleteMeme, getUserMemes } = useMemes();
  const [userMemes, setUserMemes] = useState<Meme[]>([]);
  const [draftMemes, setDraftMemes] = useState<Meme[]>([]);
  const [activeTab, setActiveTab] = useState("memes");
  const [memeToDelete, setMemeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    fetchUserMemes();
  }, []);
  
  const fetchUserMemes = async () => {
    setLoading(true);
    try {
      const memes = await getUserMemes();
      const published = memes.filter(meme => !meme.isDraft);
      const drafts = memes.filter(meme => meme.isDraft);
      
      setUserMemes(published);
      setDraftMemes(drafts);
    } catch (error) {
      console.error('Error fetching user memes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteMeme = async () => {
    if (!memeToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteMeme(memeToDelete);
      if (success) {
        setUserMemes(prevMemes => prevMemes.filter(meme => meme.id !== memeToDelete));
        setDraftMemes(prevMemes => prevMemes.filter(meme => meme.id !== memeToDelete));
        toast.success("Meme deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete meme");
    } finally {
      setIsDeleting(false);
      setMemeToDelete(null);
    }
  };
  
  const handlePublishDraft = async (meme: Meme) => {
    try {
      const API_URL = 'http://localhost:5000/api';
      const response = await axios.patch(`${API_URL}/memes/${meme.id}`, {
        isDraft: 'false'
      });
      
      if (response.data.success) {
        // Move meme from drafts to published
        setDraftMemes(prev => prev.filter(m => m.id !== meme.id));
        setUserMemes(prev => [response.data.meme, ...prev]);
        toast.success("Meme published successfully");
      }
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error("Failed to publish draft");
    }
  };
  
  // Stats calculations
  const totalUpvotes = userMemes.reduce((sum, meme) => sum + meme.upvotes, 0);
  const totalDownvotes = userMemes.reduce((sum, meme) => sum + meme.downvotes, 0);
  const totalComments = userMemes.reduce((sum, meme) => sum + meme.commentCount, 0);
  const totalViews = userMemes.reduce((sum, meme) => sum + meme.views, 0);
  
  // Best performing meme
  const bestMeme = userMemes.length > 0 
    ? userMemes.reduce((best, current) => 
        (current.upvotes - current.downvotes) > (best.upvotes - best.downvotes) ? current : best, 
        userMemes[0]
      ) 
    : null;
  
  // Account creation date
  const accountCreated = user ? new Date(Date.now() - Math.floor(Math.random() * 10000000000)) : new Date();

  return (
    <MainLayout>
      <div className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your memes and track your stats
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-brand-purple to-brand-indigo">
              <Link to="/create">Create New Meme</Link>
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Memes</CardDescription>
                <CardTitle>{userMemes.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Upvotes</CardDescription>
                <CardTitle>{totalUpvotes}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Comments</CardDescription>
                <CardTitle>{totalComments}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Views</CardDescription>
                <CardTitle>{totalViews}</CardTitle>
              </CardHeader>
            </Card>
          </div>
          
          {/* User Profile & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                        {user?.username.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></span>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold">{user?.username}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
                    <span className="text-sm font-medium">{format(accountCreated, "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className="text-sm font-medium">Meme Master</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
              </CardContent>
            </Card>
            
            {/* Meme Analytics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Meme Analytics</CardTitle>
                <CardDescription>Performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                {bestMeme ? (
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h3 className="font-semibold mb-2">Best Performing Meme</h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-full sm:w-36 h-20 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={bestMeme.imageUrl} 
                            alt="Best meme"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">{bestMeme.topText} {bestMeme.bottomText}</p>
                          <div className="flex gap-4 text-sm">
                            <span>👍 {bestMeme.upvotes}</span>
                            <span>👎 {bestMeme.downvotes}</span>
                            <span>💬 {bestMeme.commentCount}</span>
                            <span>👁️ {bestMeme.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                        <p className="text-xl font-semibold">
                          {totalViews > 0 ? Math.round((totalUpvotes + totalDownvotes + totalComments) / totalViews * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Upvotes</p>
                        <p className="text-xl font-semibold">
                          {userMemes.length > 0 ? Math.round(totalUpvotes / userMemes.length) : 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Upvote Ratio</p>
                        <p className="text-xl font-semibold">
                          {(totalUpvotes + totalDownvotes) > 0 ? Math.round(totalUpvotes / (totalUpvotes + totalDownvotes) * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Trending Potential</p>
                        <p className="text-xl font-semibold">High</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No memes created yet</p>
                    <Button asChild>
                      <Link to="/create">Create Your First Meme</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Meme Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="memes">Published ({userMemes.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftMemes.length})</TabsTrigger>
              <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="memes" className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : userMemes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">No Published Memes Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't created any memes yet. Create your first one now!
                  </p>
                  <Button asChild>
                    <Link to="/create">Create Meme</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-8">
                    {userMemes.map(meme => (
                      <MemeCard 
                        key={meme.id} 
                        meme={meme} 
                        onDelete={() => setMemeToDelete(meme.id)} 
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="drafts">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : draftMemes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">No Drafts</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You don't have any saved drafts. Start creating a new meme!
                  </p>
                  <Button asChild>
                    <Link to="/create">Create Meme</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {draftMemes.map(draft => (
                    <Card key={draft.id} className="overflow-hidden">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-medium">Draft: {draft.topText || 'Untitled'}</h3>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setMemeToDelete(draft.id)}
                          >
                            Delete
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handlePublishDraft(draft)}
                          >
                            Publish
                          </Button>
                        </div>
                      </div>
                      <div className="relative">
                        <img
                          src={draft.imageUrl}
                          alt="Draft meme"
                          className="w-full object-cover"
                          style={{ maxHeight: "300px" }}
                        />
                        
                        {draft.topText && (
                          <div className="absolute top-2 left-0 right-0 text-center meme-text px-4 text-xl md:text-2xl">
                            {draft.topText}
                          </div>
                        )}
                        
                        {draft.bottomText && (
                          <div className="absolute bottom-2 left-0 right-0 text-center meme-text px-4 text-xl md:text-2xl">
                            {draft.bottomText}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-500">
                          Last edited: {format(new Date(draft.createdAt), "MMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Detailed statistics coming soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!memeToDelete} onOpenChange={(open) => !open && setMemeToDelete(null)}>
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

export default UserDashboard;
