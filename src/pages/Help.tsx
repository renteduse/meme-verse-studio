
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  LifeBuoy, 
  FileText, 
  MessagesSquare, 
  Copy,
  CheckCircle2 
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // FAQ categories and questions
  const faqCategories = [
    {
      name: "account",
      label: "Account",
      questions: [
        {
          id: "acc-1",
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button in the top right corner of the page. You'll need to provide a username, email address, and password. After submitting, you'll receive a verification email to confirm your account."
        },
        {
          id: "acc-2",
          question: "How do I reset my password?",
          answer: "If you've forgotten your password, click on the 'Login' button, then select 'Forgot password?' Enter your email address, and we'll send you instructions to reset your password."
        },
        {
          id: "acc-3",
          question: "Can I change my username?",
          answer: "Yes, you can change your username once every 30 days. Go to your profile settings, click on 'Edit Profile', and update your username there. Remember that if you change your username, your profile URL will also change."
        },
        {
          id: "acc-4",
          question: "How do I delete my account?",
          answer: "To delete your account, go to your profile settings and scroll to the bottom. Click on 'Delete Account' and follow the prompts. Please note that account deletion is permanent and all your content will be removed."
        }
      ]
    },
    {
      name: "creating",
      label: "Creating Memes",
      questions: [
        {
          id: "create-1",
          question: "How do I create a meme?",
          answer: "To create a meme, click on the 'Create' button in the navigation menu. You can either upload your own image or choose from our template gallery. Then, add your top and bottom text, adjust font size and styling as needed, and click 'Publish' when you're ready to share."
        },
        {
          id: "create-2",
          question: "What image formats are supported?",
          answer: "We support JPG, PNG, and GIF image formats. The maximum file size is 5MB. For best results, we recommend using images with a resolution of at least 800x600 pixels."
        },
        {
          id: "create-3",
          question: "Can I edit a meme after publishing?",
          answer: "Yes, you can edit your memes after publishing. Go to your profile, find the meme you want to edit, click on the '...' menu, and select 'Edit'. You can modify the text, but you cannot change the base image once the meme is published."
        },
        {
          id: "create-4",
          question: "How do I add custom fonts or colors?",
          answer: "Currently, we offer a standard set of fonts and colors. Custom fonts and more advanced styling options are planned for a future update. Stay tuned!"
        }
      ]
    },
    {
      name: "community",
      label: "Community",
      questions: [
        {
          id: "comm-1",
          question: "What are the community guidelines?",
          answer: "We want to maintain a positive and inclusive environment. Content that is offensive, discriminatory, or violates copyright will be removed. Repeated violations may result in account suspension. See our full Community Guidelines for more details."
        },
        {
          id: "comm-2",
          question: "How do I report inappropriate content?",
          answer: "If you see content that violates our community guidelines, click on the '...' menu on the post and select 'Report'. Choose the appropriate reason for reporting and submit the form. Our moderation team will review the report promptly."
        },
        {
          id: "comm-3",
          question: "How does the voting system work?",
          answer: "Each user can upvote or downvote a meme once. You can change your vote at any time. The difference between upvotes and downvotes determines a meme's score, which affects its ranking and visibility in the feed."
        },
        {
          id: "comm-4",
          question: "What are achievements and how do I earn them?",
          answer: "Achievements are badges that recognize your contributions to the community. You can earn them by creating popular memes, being active in the community, and meeting various milestones. Visit your profile to see available achievements and your progress."
        }
      ]
    },
    {
      name: "technical",
      label: "Technical",
      questions: [
        {
          id: "tech-1",
          question: "Why can't I upload images?",
          answer: "If you're having trouble uploading images, check that your image meets our format and size requirements (JPG, PNG, or GIF under 5MB). Also, ensure you have a stable internet connection. If problems persist, try using a different browser or clearing your cache."
        },
        {
          id: "tech-2",
          question: "Is there a mobile app available?",
          answer: "Currently, we offer a mobile-responsive web application but no dedicated mobile app. However, we're working on native iOS and Android apps that will be available soon. You can add our website to your home screen for an app-like experience in the meantime."
        },
        {
          id: "tech-3",
          question: "Why is the site loading slowly?",
          answer: "Slow loading can be caused by various factors including your internet connection, browser cache, or high traffic on our servers. Try refreshing the page, clearing your browser cache, or returning at a less busy time."
        },
        {
          id: "tech-4",
          question: "How do I enable dark mode?",
          answer: "You can toggle between light and dark mode by clicking on your profile picture in the top right corner and selecting 'Appearance' from the dropdown menu. You can choose between light, dark, or system preference settings."
        }
      ]
    }
  ];
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error("Please fill out all fields");
      return;
    }
    
    // Simulate sending the message
    toast.success("Your message has been sent! We'll get back to you soon.");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };
  
  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/help#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  const filteredFAQs = () => {
    if (!searchQuery) return faqCategories;
    
    return faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.questions.length > 0);
  };
  
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
              How Can We 
              <span className="bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text"> Help You?</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Find answers to common questions or reach out to our support team for assistance.
            </p>
            <div className="flex items-center max-w-xl mx-auto relative">
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-lg h-12"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </motion.div>
        </section>
        
        {/* Quick Links */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "FAQs",
                description: "Find answers to common questions",
                icon: <FileText className="h-8 w-8" />,
                link: "#faq"
              },
              {
                title: "Contact Support",
                description: "Get help from our team",
                icon: <MessagesSquare className="h-8 w-8" />,
                link: "#contact"
              },
              {
                title: "Community Guidelines",
                description: "Learn about our rules",
                icon: <LifeBuoy className="h-8 w-8" />,
                link: "/terms"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <a href={item.link} className="inline-block">
                  <div className="mb-4 text-primary">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            
            {/* FAQ Tab */}
            <TabsContent value="faq" id="faq">
              <div className="max-w-3xl mx-auto">
                {filteredFAQs().map((category) => (
                  category.questions.length > 0 && (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-12"
                    >
                      <h2 className="text-2xl font-bold mb-6">{category.label}</h2>
                      <Accordion type="single" collapsible className="space-y-4">
                        {category.questions.map((item) => (
                          <AccordionItem 
                            key={item.id} 
                            value={item.id} 
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger 
                              className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
                              onClick={() => setSelectedQuestion(selectedQuestion === item.id ? null : item.id)}
                            >
                              <div className="text-left font-medium">
                                {item.question}
                              </div>
                              {selectedQuestion === item.id ? (
                                <ChevronUp className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-gray-700" />
                              ) : (
                                <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-gray-700" />
                              )}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <div className="text-gray-600 dark:text-gray-400 mb-4">
                                {item.answer}
                              </div>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <div>Was this helpful?</div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs flex items-center gap-2"
                                  onClick={() => handleCopyLink(item.id)}
                                >
                                  {copiedId === item.id ? (
                                    <>
                                      <CheckCircle2 className="h-4 w-4" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4" />
                                      Copy link
                                    </>
                                  )}
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  )
                ))}
                
                {searchQuery && filteredFAQs().every(category => category.questions.length === 0) && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No results found for "{searchQuery}"</p>
                    <Button 
                      variant="link"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  </div>
                )}
                
                <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                  <h3 className="text-xl font-semibold mb-3">Still need help?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    If you couldn't find what you're looking for in our FAQs, please reach out to our support team.
                  </p>
                  <Button className="bg-gradient-to-r from-brand-purple to-brand-indigo" asChild>
                    <Link to="#contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Contact Tab */}
            <TabsContent value="contact" id="contact">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Fill out the form below and our support team will get back to you as soon as possible, usually within 24 hours.
                  </p>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </label>
                        <Input 
                          id="name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input 
                          id="email"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        How can we help you?
                      </label>
                      <Textarea 
                        id="message"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Describe your issue or question in detail"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-brand-purple to-brand-indigo">
                      Send Message
                    </Button>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By submitting this form, you agree to our <Link to="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                    </p>
                  </form>
                </div>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Email Support",
                      value: "support@imagegenhub.com",
                      icon: <LifeBuoy className="h-6 w-6" />
                    },
                    {
                      title: "Response Time",
                      value: "Within 24 hours",
                      icon: <MessagesSquare className="h-6 w-6" />
                    },
                    {
                      title: "Working Hours",
                      value: "Mon-Fri, 9AM-5PM EST",
                      icon: <FileText className="h-6 w-6" />
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center"
                    >
                      <div className="mb-3 text-primary inline-flex p-3 rounded-full bg-primary/10">
                        {item.icon}
                      </div>
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </MainLayout>
  );
};

export default Help;
