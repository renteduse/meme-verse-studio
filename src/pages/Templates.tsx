
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Template categories and images
const categories = [
  "All",
  "Coding",
  "Tech",
  "Reactions",
  "Animals",
  "Popular",
  "Gaming",
];

// Template images
const templateImages = [
  {
    id: "template1",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    name: "Glowing Computer",
    categories: ["Tech", "Coding"],
    popular: true
  },
  {
    id: "template2",
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    name: "Coding Screen",
    categories: ["Tech", "Coding"],
    popular: true
  },
  {
    id: "template3",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    name: "Matrix Code",
    categories: ["Tech", "Coding"],
    popular: true
  },
  {
    id: "template4",
    url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    name: "Code Close-up",
    categories: ["Tech", "Coding"]
  },
  {
    id: "template5",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    name: "Programming Laptop",
    categories: ["Tech", "Coding"]
  },
  {
    id: "template6",
    url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    name: "Video Display",
    categories: ["Tech"]
  },
  {
    id: "template7",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    name: "Laptop Work",
    categories: ["Tech", "Reactions"]
  },
  {
    id: "template8",
    url: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    name: "Forest Light",
    categories: ["Popular"]
  },
  {
    id: "template9",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    name: "Serene Lake",
    categories: ["Popular"]
  }
];

const Templates = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTemplates = templateImages.filter(template => {
    // Filter by category
    const passesCategory = selectedCategory === "All" || 
      selectedCategory === "Popular" && template.popular || 
      template.categories.includes(selectedCategory);
      
    // Filter by search
    const passesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return passesCategory && passesSearch;
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="py-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ready-to-Use 
              <span className="bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text"> Meme Templates</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Browse our curated collection of meme templates and start creating instantly. Pick a template, add your text, and share your creation with the world.
            </p>
            <div className="flex items-center max-w-md mx-auto relative">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>
        </section>
        
        {/* Templates Section */}
        <section className="container mx-auto px-4">
          {/* Categories */}
          <div className="mb-8">
            <TabsList className="flex gap-2 overflow-x-auto pb-2 justify-start w-full max-w-full">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category 
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Templates Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800"
                >
                  <Link 
                    to={isAuthenticated ? `/create?template=${template.url}` : "/login"}
                    className="block"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={template.url} 
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium text-lg mb-2">{template.name}</h3>
                      <div className="flex gap-2 flex-wrap">
                        {template.categories.map(cat => (
                          <span key={cat} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No templates found matching "{searchQuery}"</p>
                <Button 
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* Upload CTA */}
          <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-3">Can't find what you're looking for?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              You can always upload your own image to create a custom meme from scratch.
              Our editor makes it easy to add text and customize your creation.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-brand-purple to-brand-indigo" asChild>
              <Link to={isAuthenticated ? "/create" : "/login"}>
                Upload Your Own Image
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Tips Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3">How to Choose a Template</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pick a template that matches the emotion or situation you want to convey. The right image makes your text more impactful.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3">Creating Effective Memes</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep text short and punchy. Use contrast between the setup and punchline for maximum humor and engagement.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold mb-3">Sharing Your Creation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                After creating your meme, share it to your feed and add relevant tags to help others discover your content.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Templates;
