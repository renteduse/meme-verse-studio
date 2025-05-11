
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const About = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former software engineer with a passion for memes and community building.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Sophia Chen",
      role: "CTO",
      bio: "Full-stack developer who loves creating tools that bring joy to people's digital lives.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Marcus Rodriguez",
      role: "Creative Director",
      bio: "Designer with a knack for UI/UX and a background in digital content creation.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Priya Patel",
      role: "Community Manager",
      bio: "Social media expert who builds and nurtures online communities with care.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  const stats = [
    { value: "5M+", label: "Memes Created" },
    { value: "250K+", label: "Active Users" },
    { value: "12M+", label: "Monthly Views" },
    { value: "180+", label: "Countries" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
              About 
              <span className="bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text"> ImageGenHub</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              We're building the best platform for creating, sharing, and discovering memes. Our mission is to bring joy and connection through the universal language of memes.
            </p>
          </motion.div>
        </section>

        {/* Our Story */}
        <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    ImageGenHub began in 2023 when a group of developers and meme enthusiasts realized there wasn't a dedicated platform that truly celebrated meme culture while providing powerful creation tools.
                  </p>
                  <p>
                    What started as a weekend project quickly grew into something bigger as more people discovered our platform and began creating and sharing their own memes.
                  </p>
                  <p>
                    Today, we're proud to have built a vibrant community of creators who use our platform to express themselves, connect with others, and spread joy through humor and creativity.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center">
                  <div className="text-7xl bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text text-center font-bold">
                    ImageGenHub
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-brand-purple rounded-lg opacity-20 animate-pulse"></div>
                <div className="absolute -top-5 -right-5 w-16 h-16 bg-brand-indigo rounded-lg opacity-20 animate-pulse delay-300"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Our Values */}
        <section className="bg-white dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-4"
              >
                Our Core Values
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                These principles guide everything we do, from product development to community management.
              </motion.p>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                {
                  title: "Creativity",
                  description: "We believe in empowering everyone to express themselves creatively, regardless of technical skill.",
                  color: "from-purple-400 to-purple-600"
                },
                {
                  title: "Community",
                  description: "We're committed to fostering a positive, supportive environment where creators can connect.",
                  color: "from-blue-400 to-blue-600"
                },
                {
                  title: "Accessibility",
                  description: "Our tools are designed to be easy to use and accessible to everyone, everywhere.",
                  color: "from-green-400 to-green-600"
                },
                {
                  title: "Innovation",
                  description: "We're constantly improving our platform with new features and tools based on user feedback.",
                  color: "from-orange-400 to-orange-600"
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${value.color}`}></div>
                  <h3 className="text-xl font-semibold mt-4 mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Team */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              The passionate people behind ImageGenHub who are dedicated to building the best meme creation platform.
            </motion.p>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* CTA */}
        <section className="bg-gradient-to-r from-brand-purple to-brand-indigo text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="max-w-2xl mx-auto mb-8">
                Become part of the ImageGenHub family today and start creating, sharing, and discovering amazing memes from around the world.
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

export default About;
