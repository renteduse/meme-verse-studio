
import { useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useMemes } from "@/hooks/useMemes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemeCanvas from "@/components/meme/MemeCanvas";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";

// Sample template images
const templateImages = [
  {
    id: "template1",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    name: "Glowing Computer"
  },
  {
    id: "template2",
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    name: "Coding Screen"
  },
  {
    id: "template3",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    name: "Matrix Code"
  },
  {
    id: "template4",
    url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    name: "Code Close-up"
  },
  {
    id: "template5",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    name: "Programming Laptop"
  },
  {
    id: "template6",
    url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    name: "Video Display"
  }
];

const MemeCreator = () => {
  const { isAuthenticated, user } = useAuth();
  const { createMeme } = useMemes();
  const navigate = useNavigate();
  
  const [imageUrl, setImageUrl] = useState(templateImages[0].url);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(40);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      if (tags.length >= 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }
      
      if (!tags.includes(currentTag.trim().toLowerCase())) {
        setTags([...tags, currentTag.trim().toLowerCase()]);
      }
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSelectTemplate = (templateUrl: string) => {
    setImageUrl(templateUrl);
    setUploadedImage(null);
  };

  const handleCanvasRendered = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };

  const handleCreateMeme = async () => {
    if (!imageUrl) {
      toast.error("Please select or upload an image");
      return;
    }

    setIsCreating(true);

    try {
      if (user) {
        const newMeme = await createMeme({
          imageUrl,
          topText,
          bottomText,
          userId: user.id,
          username: user.username,
          userAvatar: user.avatar,
          tags
        });
        
        navigate(`/meme/${newMeme.id}`);
      }
    } catch (error) {
      console.error("Failed to create meme:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-5xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Create Your Meme</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload an image or choose a template, then add your custom text
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Meme Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
                
                <MemeCanvas 
                  imageUrl={imageUrl}
                  topText={topText}
                  bottomText={bottomText}
                  fontSize={fontSize}
                  onImageRendered={handleCanvasRendered}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Image Source */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Image Source</h2>
                
                <Tabs defaultValue="templates">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="templates" className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {templateImages.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${
                            imageUrl === template.url && !uploadedImage
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() => handleSelectTemplate(template.url)}
                        >
                          <img 
                            src={template.url} 
                            alt={template.name}
                            className="w-full h-20 object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      
                      {uploadedImage ? (
                        <div className="space-y-3">
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded preview"
                            className="max-h-40 mx-auto"
                          />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <p className="text-sm font-medium">
                            Click to upload an image
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or GIF (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Meme Text */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Meme Text</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="top-text">Top Text</Label>
                    <Input
                      id="top-text"
                      placeholder="WHEN YOUR CODE WORKS"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bottom-text">Bottom Text</Label>
                    <Input
                      id="bottom-text"
                      placeholder="BUT YOU DON'T KNOW WHY"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="font-size">Font Size</Label>
                      <span className="text-sm">{fontSize}px</span>
                    </div>
                    <Slider
                      id="font-size"
                      min={20}
                      max={80}
                      step={1}
                      value={[fontSize]}
                      onValueChange={(values) => setFontSize(values[0])}
                    />
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Add Tags (max 5)</Label>
                    <Input
                      id="tags"
                      placeholder="Enter tag and press Enter"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleAddTag}
                      disabled={tags.length >= 5}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                        <span className="ml-2">×</span>
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tags added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Create Button */}
              <Button 
                className="w-full bg-gradient-to-r from-brand-purple to-brand-indigo"
                size="lg"
                onClick={handleCreateMeme}
                disabled={isCreating || !imageUrl}
              >
                {isCreating ? "Creating..." : "Create Meme"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default MemeCreator;
