
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Award, TrendingUp, Star } from "lucide-react";

// Sample creators data
const creatorsData = [
  {
    id: "1",
    username: "MemeKing",
    realName: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Making dev jokes since before they compiled.",
    followers: 48500,
    posts: 342,
    achievements: ["Top Creator", "Viral Hit", "Weekly Champion"],
    tags: ["tech", "programming", "webdev"],
    featured: true,
    trending: true,
    new: false
  },
  {
    id: "2",
    username: "CodeMaster",
    realName: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Frontend dev by day, meme lord by night.",
    followers: 32100,
    posts: 215,
    achievements: ["Top Creator", "Design Star"],
    tags: ["frontend", "ui", "design"],
    featured: true,
    trending: false,
    new: false
  },
  {
    id: "3",
    username: "DebugThis",
    realName: "Marcus Rodriguez",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Turning bugs into laughs since 2015.",
    followers: 25800,
    posts: 189,
    achievements: ["Viral Hit"],
    tags: ["debug", "programming", "backend"],
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "4",
    username: "DevJokes",
    realName: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Spreading laughs one code joke at a time.",
    followers: 19200,
    posts: 156,
    achievements: ["Weekly Champion"],
    tags: ["jokes", "humor", "tech"],
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "5",
    username: "GIFMaster",
    realName: "Jordan Lee",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Creator of the perfect reaction GIFs.",
    followers: 17600,
    posts: 320,
    achievements: ["Content Machine"],
    tags: ["gif", "reactions", "funny"],
    featured: false,
    trending: false,
    new: true
  },
  {
    id: "6",
    username: "UIUXMemes",
    realName: "Taylor Swift",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Design fails that make you laugh and learn.",
    followers: 15900,
    posts: 98,
    achievements: ["Design Star"],
    tags: ["ui", "ux", "design"],
    featured: false,
    trending: false,
    new: true
  },
  {
    id: "7",
    username: "AgileHumor",
    realName: "Jamal Wilson",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Making sprints a little more fun.",
    followers: 12300,
    posts: 87,
    achievements: ["Rising Star"],
    tags: ["agile", "scrum", "management"],
    featured: false,
    trending: false,
    new: true
  },
  {
    id: "8",
    username: "AIJester",
    realName: "Olivia Martinez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "When AI tries to tell jokes but fails spectacularly.",
    followers: 10500,
    posts: 65,
    achievements: ["Innovator"],
    tags: ["ai", "ml", "tech"],
    featured: false,
    trending: false,
    new: true
  }
];

const Creators = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filterCreators = () => {
    return creatorsData.filter(creator => {
      // Filter by category
      if (activeFilter === "featured" && !creator.featured) return false;
      if (activeFilter === "trending" && !creator.trending) return false;
      if (activeFilter === "new" && !creator.new) return false;
      
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return creator.username.toLowerCase().includes(query) ||
               creator.realName.toLowerCase().includes(query) ||
               creator.tags.some(tag => tag.includes(query));
      }
      
      return true;
    });
  };
  
  const filteredCreators = filterCreators();
  
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
              Meet Our 
              <span className="bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text"> Creator Community</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Discover the talented individuals behind your favorite memes. Follow creators, get inspired, and join the community.
            </p>
            <div className="flex items-center max-w-md mx-auto relative">
              <Input
                placeholder="Search creators by name or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>
        </section>
        
        {/* Featured Creator */}
        {activeFilter === "all" && !searchQuery && (
          <section className="container mx-auto px-4 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-gradient-to-r from-brand-purple to-brand-indigo text-white rounded-xl overflow-hidden shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge variant="secondary" className="mb-6 w-fit">Featured Creator</Badge>
                  <h2 className="text-3xl font-bold mb-3">{creatorsData[0].realName}</h2>
                  <h3 className="text-xl opacity-90 mb-4">@{creatorsData[0].username}</h3>
                  <p className="mb-6 opacity-90">{creatorsData[0].bio}</p>
                  <div className="flex gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold">{creatorsData[0].followers.toLocaleString()}</div>
                      <div className="text-sm opacity-75">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{creatorsData[0].posts}</div>
                      <div className="text-sm opacity-75">Memes</div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-6">
                    {creatorsData[0].tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/30 text-white">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="bg-white text-primary hover:bg-white/90 w-fit" asChild>
                    <Link to={`/user/${creatorsData[0].id}`}>View Profile</Link>
                  </Button>
                </div>
                <div className="hidden md:block relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <img 
                    src={creatorsData[0].avatar} 
                    alt={creatorsData[0].username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </section>
        )}
        
        {/* Creators List */}
        <section className="container mx-auto px-4">
          {/* Filter Tabs */}
          <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
            <Tabs defaultValue="all" className="w-fit">
              <TabsList>
                <TabsTrigger 
                  value="all" 
                  onClick={() => setActiveFilter("all")}
                  className={activeFilter === "all" ? "bg-primary text-primary-foreground" : ""}
                >
                  All Creators
                </TabsTrigger>
                <TabsTrigger 
                  value="featured" 
                  onClick={() => setActiveFilter("featured")}
                  className={activeFilter === "featured" ? "bg-primary text-primary-foreground" : ""}
                >
                  <Award className="h-4 w-4 mr-1" />
                  Featured
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  onClick={() => setActiveFilter("trending")}
                  className={activeFilter === "trending" ? "bg-primary text-primary-foreground" : ""}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trending
                </TabsTrigger>
                <TabsTrigger 
                  value="new" 
                  onClick={() => setActiveFilter("new")}
                  className={activeFilter === "new" ? "bg-primary text-primary-foreground" : ""}
                >
                  <Star className="h-4 w-4 mr-1" />
                  New
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredCreators.length} creators
            </div>
          </div>
          
          {/* Creators Grid */}
          {filteredCreators.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCreators.map((creator) => (
                <motion.div
                  key={creator.id}
                  variants={itemVariants}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={creator.avatar} alt={creator.username} />
                        <AvatarFallback>{creator.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link to={`/user/${creator.id}`} className="text-xl font-semibold hover:text-primary transition-colors">
                          @{creator.username}
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{creator.realName}</p>
                        
                        <div className="flex items-center gap-3 mt-1">
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{creator.followers.toLocaleString()}</span> followers
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{creator.posts}</span> memes
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {creator.bio}
                    </p>
                    
                    {creator.achievements.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {creator.achievements.map((achievement) => (
                            <div 
                              key={achievement} 
                              className="flex items-center text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full"
                            >
                              <Award className="h-3 w-3 mr-1" />
                              {achievement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {creator.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="default" className="flex-1" asChild>
                        <Link to={`/user/${creator.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Follow
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No creators found matching your search</p>
              <Button 
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>
        
        {/* Join CTA */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Become a Creator</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Join our growing community of meme creators. Share your creations, gain followers, and even earn recognition through our achievement system.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-brand-purple to-brand-indigo" asChild>
              <Link to="/signup">Create Account</Link>
            </Button>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Creators;
