
import { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, Upload, Heart, MessageCircle, Layers, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      title: "Meme Creation Studio",
      description: "Create custom memes with our easy-to-use studio. Upload your own images or choose from our template gallery.",
      icon: <Upload className="w-12 h-12 text-primary" />,
      items: [
        "Upload your own images or choose from templates",
        "Add custom text to top and bottom",
        "Adjust font size and styling",
        "Preview in real-time before publishing"
      ]
    },
    {
      title: "Voting System",
      description: "Let the community decide which memes rise to the top with our intuitive voting system.",
      icon: <Heart className="w-12 h-12 text-primary" />,
      items: [
        "Upvote and downvote memes you love or hate",
        "One vote per user to keep it fair",
        "See total upvotes and downvotes",
        "Trending algorithm highlights popular content"
      ]
    },
    {
      title: "Comments & Discussion",
      description: "Engage with other creators through our comment system on every meme.",
      icon: <MessageCircle className="w-12 h-12 text-primary" />,
      items: [
        "Comment on any meme to share your thoughts",
        "Reply to existing comments",
        "Flag inappropriate content",
        "Get notifications when someone replies to you"
      ]
    },
    {
      title: "Organized Feed",
      description: "Browse memes your way with multiple sorting options and categories.",
      icon: <Layers className="w-12 h-12 text-primary" />,
      items: [
        "Sort by new, trending, or all-time best",
        "Filter by tags and categories",
        "Infinite scroll for seamless browsing",
        "Save your favorite memes for later"
      ]
    },
    {
      title: "Creator Dashboard",
      description: "Track the performance of your memes with comprehensive analytics.",
      icon: <Users className="w-12 h-12 text-primary" />,
      items: [
        "See total views, votes, and comments",
        "Track performance over time",
        "Manage all your created content",
        "Edit or delete your existing memes"
      ]
    },
    {
      title: "Rewards & Recognition",
      description: "Get recognized for your creativity with our achievements system.",
      icon: <Star className="w-12 h-12 text-primary" />,
      items: [
        "Earn badges for popular content",
        "Get featured on the homepage",
        "Weekly and monthly leaderboards",
        "Special creator recognition"
      ]
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
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
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text"> Meme Creators</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Discover all the tools and features that make ImageGenHub the perfect platform for creating, sharing, and discovering the best memes on the web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-brand-purple to-brand-indigo">
                <Link to="/create">Start Creating</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/feed">Browse Memes</Link>
              </Button>
            </div>
          </motion.div>
        </section>
        
        {/* Main Features */}
        <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold text-center mb-16"
            >
              Everything You Need to Create Amazing Memes
            </motion.h2>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Feature Details */}
        <section className="container mx-auto px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Explore Our Key Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Take a deeper dive into what makes ImageGenHub the best platform for meme creators and enthusiasts alike.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-1">
              {features.map((feature, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeFeature === index 
                    ? "bg-primary/10 border-l-4 border-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="lg:col-span-2">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md"
              >
                <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {features[activeFeature].description}
                </p>
                
                <div className="aspect-video mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-5xl p-12">{features[activeFeature].icon}</div>
                </div>
                
                <h4 className="font-semibold mb-3">Key Capabilities:</h4>
                <ul className="space-y-3">
                  {features[activeFeature].items.map((item, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <ChevronRight className="h-5 w-5 text-primary mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t">
                  <Button asChild className="bg-gradient-to-r from-brand-purple to-brand-indigo">
                    <Link to="/create">Try {features[activeFeature].title} Now</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand-purple to-brand-indigo text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
              <p className="max-w-2xl mx-auto mb-8">
                Join thousands of creators who are already making and sharing amazing memes on ImageGenHub. Sign up today and unleash your creativity!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <Link to="/feed">Explore Feed</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Features;
