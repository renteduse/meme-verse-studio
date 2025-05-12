
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useMemes } from "@/hooks/useMemes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Trash, Save, PencilLine } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const EditMeme = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMemeById, updateMeme, deleteMeme } = useMemes();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [meme, setMeme] = useState<any>(null);
  const [formValues, setFormValues] = useState({
    topText: "",
    bottomText: "",
    tags: [] as string[],
    fontSize: 40,
    fontColor: "#FFFFFF",
    isDraft: false
  });
  const [tagInput, setTagInput] = useState("");
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to edit memes");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
        navigate("/dashboard");
        return;
      }
      
      // Check if user is the creator
      if (user?.id !== memeData.creator.id) {
        toast.error("You are not authorized to edit this meme");
        navigate(`/meme/${id}`);
        return;
      }
      
      setMeme(memeData);
      setFormValues({
        topText: memeData.topText || "",
        bottomText: memeData.bottomText || "",
        tags: memeData.tags || [],
        fontSize: memeData.fontSize || 40,
        fontColor: memeData.fontColor || "#FFFFFF",
        isDraft: memeData.isDraft || false
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load meme");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim().toLowerCase();
    
    if (formValues.tags.includes(newTag)) {
      toast.error("Tag already exists");
      return;
    }
    
    setFormValues({
      ...formValues,
      tags: [...formValues.tags, newTag]
    });
    setTagInput("");
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormValues({
      ...formValues,
      tags: formValues.tags.filter(t => t !== tag)
    });
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meme) return;
    
    setIsSaving(true);
    
    try {
      await updateMeme(meme.id, formValues);
      toast.success("Meme updated successfully");
      navigate(`/meme/${meme.id}`);
    } catch (error) {
      toast.error("Failed to update meme");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!meme) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteMeme(meme.id);
      if (success) {
        toast.success("Meme deleted successfully");
        navigate("/dashboard");
      } else {
        throw new Error("Failed to delete meme");
      }
    } catch (error) {
      toast.error("Failed to delete meme");
    } finally {
      setIsDeleting(false);
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
          <Card className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Meme Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The meme you're trying to edit doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <a href="/dashboard">Back to Dashboard</a>
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
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PencilLine className="h-6 w-6" />
                Edit Meme
              </CardTitle>
              <CardDescription>
                Update your meme's text, formatting, and other details
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Meme Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preview</h3>
                    <div className="relative border rounded-md overflow-hidden bg-gray-900 min-h-[300px]">
                      <img 
                        src={meme.imageUrl} 
                        alt="Meme Preview" 
                        className="w-full object-contain"
                        style={{ maxHeight: '400px' }}
                      />
                      
                      {formValues.topText && (
                        <div 
                          className="absolute top-2 left-0 right-0 text-center px-4"
                          style={{ 
                            fontSize: `${formValues.fontSize}px`,
                            color: formValues.fontColor
                          }}
                        >
                          {formValues.topText}
                        </div>
                      )}
                      
                      {formValues.bottomText && (
                        <div 
                          className="absolute bottom-2 left-0 right-0 text-center px-4"
                          style={{ 
                            fontSize: `${formValues.fontSize}px`,
                            color: formValues.fontColor
                          }}
                        >
                          {formValues.bottomText}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Edit Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topText">Top Text</Label>
                      <Input 
                        id="topText"
                        name="topText"
                        value={formValues.topText}
                        onChange={handleInputChange}
                        placeholder="Enter top text"
                        maxLength={100}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bottomText">Bottom Text</Label>
                      <Input 
                        id="bottomText"
                        name="bottomText"
                        value={formValues.bottomText}
                        onChange={handleInputChange}
                        placeholder="Enter bottom text"
                        maxLength={100}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fontSize">Font Size: {formValues.fontSize}px</Label>
                      <Slider
                        id="fontSize"
                        min={20}
                        max={80}
                        step={1}
                        value={[formValues.fontSize]}
                        onValueChange={(vals) => setFormValues({...formValues, fontSize: vals[0]})}
                        className="py-4"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fontColor">Font Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          id="fontColor"
                          name="fontColor"
                          value={formValues.fontColor}
                          onChange={handleInputChange}
                          className="w-12 h-12 p-1 border rounded cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={formValues.fontColor}
                          onChange={handleInputChange}
                          name="fontColor"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tag-input"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add a tag"
                          className="flex-1"
                          maxLength={20}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddTag}>Add</Button>
                      </div>
                      
                      {formValues.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formValues.tags.map((tag) => (
                            <div 
                              key={tag} 
                              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              #{tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-secondary-foreground/70 hover:text-secondary-foreground"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="draft"
                        checked={formValues.isDraft}
                        onCheckedChange={(checked) => setFormValues({...formValues, isDraft: checked})}
                      />
                      <Label htmlFor="draft">Save as draft</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting || isSaving}
                  >
                    {isDeleting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Meme
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="submit"
                    disabled={isSaving || isDeleting}
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
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default EditMeme;
