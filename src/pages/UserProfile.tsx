
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Save, User, MapPin, Globe } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import axios from "axios";

const UserProfile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: ""
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to view your profile");
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);

  // Load user data
  useEffect(() => {
    if (user) {
      setFormValues({
        displayName: user.displayName || user.username,
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || ""
      });
      
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await axios.patch('http://localhost:5000/api/profile', formValues);
      
      if (response.data.success) {
        // Update auth context
        updateUser({
          ...user,
          ...response.data.user
        });
        
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatar) return;
    
    setIsUploadingAvatar(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      
      const response = await axios.post('http://localhost:5000/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Update auth context
        updateUser({
          ...user,
          avatar: response.data.avatar
        });
        
        toast.success("Avatar updated successfully");
        
        // Clear file input
        setAvatar(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
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

  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold">Your Profile</h1>
          
          {/* Avatar Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your avatar</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={avatarPreview || "default"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar Preview" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                          {user?.username.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Upload new picture</Label>
                    <Input 
                      id="avatar" 
                      type="file" 
                      onChange={handleAvatarChange} 
                      accept="image/*"
                    />
                    <p className="text-sm text-gray-500">
                      Recommended: Square JPG, PNG. Max size: 2MB
                    </p>
                  </div>
                  
                  {avatar && (
                    <Button 
                      onClick={handleUploadAvatar}
                      disabled={isUploadingAvatar}
                      className="w-full md:w-auto hover:scale-105 transition-all"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Avatar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <Input 
                          id="displayName"
                          name="displayName"
                          value={formValues.displayName}
                          onChange={handleInputChange}
                          placeholder="Display Name"
                          className="hover:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio"
                        name="bio"
                        value={formValues.bio}
                        onChange={handleInputChange}
                        placeholder="Write a short bio about yourself"
                        rows={4}
                        className="hover:border-primary transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <Input 
                          id="location"
                          name="location"
                          value={formValues.location}
                          onChange={handleInputChange}
                          placeholder="City, Country"
                          className="hover:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <Input 
                          id="website"
                          name="website"
                          value={formValues.website}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                          className="hover:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="hover:scale-105 transition-all"
                  >
                    Back to Dashboard
                  </Button>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    >
                      {isSaving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
