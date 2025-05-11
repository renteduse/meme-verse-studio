
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useMemes, Meme } from "@/hooks/useMemes";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import MemeCard from "@/components/meme/MemeCard";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import axios from "axios";
import { Globe, MapPin, Calendar, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  createdAt: string;
}

interface ProfileStats {
  memesCount: number;
  draftsCount: number;
  totalUpvotes: number;
  totalViews: number;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { getMemeById } = useMemes();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("memes");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: ""
  });
  
  const isOwnProfile = isAuthenticated && user?.id === userId;

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchUserMemes();
    }
  }, [userId]);
  
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || ""
      });
    }
  }, [profile]);
  
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${userId}`);
      if (response.data.success) {
        setProfile(response.data.profile);
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserMemes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/memes`);
      if (response.data.success) {
        // Filter the memes by this user
        const userMemes = response.data.memes.filter(
          (meme: any) => meme.creator.id === userId && !meme.isDraft
        );
        
        // Format the memes
        const formattedMemes = userMemes.map((meme: any) => ({
          id: meme._id,
          _id: meme._id,
          imageUrl: meme.imageUrl,
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
          commentCount: meme.commentCount,
          views: meme.views,
          tags: meme.tags,
          fontSize: meme.fontSize,
          fontColor: meme.fontColor,
          isFlagged: meme.isFlagged
        }));
        
        setMemes(formattedMemes);
      }
    } catch (error) {
      toast.error("Failed to load memes");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwnProfile) return;
    
    setIsEditingProfile(true);
    
    try {
      const response = await axios.patch(`http://localhost:5000/api/profile`, formData);
      
      if (response.data.success) {
        // Update local profile data
        setProfile(prev => prev ? { ...prev, ...response.data.user } : null);
        toast.success("Profile updated successfully");
        setEditDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsEditingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAvatar) return;
    
    setIsUploadingAvatar(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', selectedAvatar);
      
      const response = await axios.post(`http://localhost:5000/api/profile/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Update local profile data
        setProfile(prev => prev ? { ...prev, avatar: response.data.avatar } : null);
        toast.success("Avatar updated successfully");
        setAvatarDialogOpen(false);
        
        // Clear selected file and preview
        setSelectedAvatar(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container px-4 py-20">
          <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container px-4 py-20">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The profile you're looking for doesn't exist or has been removed.
            </p>
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
      <div className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="relative rounded-lg bg-gradient-to-r from-purple-500/30 to-indigo-500/30 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <motion.div
                  whileHover={isOwnProfile ? { scale: 1.05 } : {}}
                  className="relative"
                >
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.username}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                      {profile.username.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  
                  {isOwnProfile && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full p-2 bg-white dark:bg-gray-800"
                      onClick={() => setAvatarDialogOpen(true)}
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                </motion.div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.displayName || profile.username}</h1>
                    <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
                  </div>
                  
                  {isOwnProfile && (
                    <Button 
                      variant="outline"
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
                      onClick={() => setEditDialogOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  {profile.bio && (
                    <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
                    {profile.location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center">
                        <Globe size={16} className="mr-1" />
                        <a 
                          href={profile.website.startsWith('http') ? profile.website : `http://${profile.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          {profile.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Memes</CardDescription>
                    <CardTitle>{stats.memesCount}</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Upvotes</CardDescription>
                    <CardTitle>{stats.totalUpvotes}</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Views</CardDescription>
                    <CardTitle>{stats.totalViews}</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Engagement Rate</CardDescription>
                    <CardTitle>
                      {stats.totalViews > 0 
                        ? Math.round((stats.totalUpvotes / stats.totalViews) * 100) 
                        : 0}%
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          )}
          
          {/* Memes Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="memes">Memes</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="memes" className="space-y-6">
              {memes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">No Memes Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {isOwnProfile 
                      ? "You haven't created any memes yet. Create your first one now!"
                      : `${profile.displayName || profile.username} hasn't created any memes yet.`}
                  </p>
                  
                  {isOwnProfile && (
                    <Button asChild>
                      <Link to="/create">Create Meme</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {memes.map(meme => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About {profile.displayName || profile.username}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Bio</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {profile.bio || "No bio provided"}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Location</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {profile.location || "Not specified"}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Website</h3>
                    {profile.website ? (
                      <a 
                        href={profile.website.startsWith('http') ? profile.website : `http://${profile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      <p className="mt-1 text-gray-600 dark:text-gray-400">Not provided</p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Member since</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {format(new Date(profile.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleProfileUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Tell us a bit about yourself"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., New York, USA"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., https://yourwebsite.com"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isEditingProfile}>
                {isEditingProfile ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. Square images work best.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAvatarUpload}>
            <div className="grid gap-6 py-4">
              {avatarPreview && (
                <div className="flex justify-center">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="avatar">Select an image</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum file size: 2MB. Supported formats: JPEG, PNG, GIF
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAvatarDialogOpen(false);
                  setSelectedAvatar(null);
                  setAvatarPreview(null);
                }}
                disabled={isUploadingAvatar}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!selectedAvatar || isUploadingAvatar}
              >
                {isUploadingAvatar ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Profile;
