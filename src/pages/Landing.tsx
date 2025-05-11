
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { AnimatedGradientButton } from "@/components/ui/gradient-button";

const Landing = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  };

  return (
    <MainLayout className="bg-mesh">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1 
              variants={fadeIn} 
              custom={0}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Create & Share Memes with the 
              <span className="bg-gradient-to-r from-brand-purple to-brand-pink text-transparent bg-clip-text">
                {" "}Developer Community
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn} 
              custom={1}
              className="text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              The ultimate platform for developers to create, share, and vote on the most epic code memes.
            </motion.p>
            
            <motion.div 
              variants={fadeIn} 
              custom={2}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <AnimatedGradientButton size="lg" asChild>
                <Link to="/signup">Start Creating</Link>
              </AnimatedGradientButton>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/feed">Browse Memes</Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Floating Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-2xl shadow-purple-500/10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                alt="ImageGenHub Preview"
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: "500px" }}
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/30">
                <div className="text-white text-center meme-text text-4xl md:text-5xl max-w-lg px-4">
                  WHEN YOUR CODE WORKS
                </div>
                <div className="text-white text-center meme-text text-4xl md:text-5xl max-w-lg px-4 absolute bottom-10">
                  BUT YOU DON'T KNOW WHY
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Powerful Features for Meme Creators
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Everything you need to create, share, and interact with the best developer memes on the web.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Meme Creation",
                description: "Upload images or choose from templates. Add text overlays with customizable fonts and positioning.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )
              },
              {
                title: "Community Voting",
                description: "Upvote your favorite memes and see what's trending. The best content rises to the top.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                )
              },
              {
                title: "Creator Dashboard",
                description: "Track your meme performance with detailed stats. See votes, comments, and views at a glance.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <path d="M18 10a2 2 0 0 1 0-4h4v4Z" />
                    <path d="M12 4a2 2 0 0 0 0-4h4v4Z" />
                    <path d="M6 14a2 2 0 0 1 0-4h4v4Z" />
                  </svg>
                )
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              From creation to virality, follow these simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up for free and join our community of developers and meme enthusiasts."
              },
              {
                step: "02",
                title: "Create or Upload",
                description: "Use our meme generator or upload your own images to customize."
              },
              {
                step: "03",
                title: "Add Text & Effects",
                description: "Customize with the perfect caption and visual effects."
              },
              {
                step: "04",
                title: "Share & Get Votes",
                description: "Publish to the community and collect upvotes and comments."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 h-full">
                  <div className="text-4xl font-bold text-primary/30 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 
              variants={fadeIn} 
              custom={0}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Create Your First Meme?
            </motion.h2>
            <motion.p 
              variants={fadeIn} 
              custom={1}
              className="text-xl mb-8 text-gray-300"
            >
              Join thousands of developers sharing laughs through code memes.
            </motion.p>
            <motion.div 
              variants={fadeIn} 
              custom={2}
            >
              <AnimatedGradientButton size="lg" asChild>
                <Link to="/signup">Sign Up Now — It's Free</Link>
              </AnimatedGradientButton>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Landing;
