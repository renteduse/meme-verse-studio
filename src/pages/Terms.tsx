
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const Terms = () => {
  // Last updated date
  const lastUpdated = "May 10, 2025";
  
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: `By accessing or using ImageGenHub ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service. These Terms of Service apply to all visitors, users, and others who access or use the Service.`
    },
    {
      id: "accounts",
      title: "User Accounts",
      content: `When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. You may never use another person's user account without permission.`
    },
    {
      id: "content",
      title: "User Content",
      content: `Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness. By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.`
    },
    {
      id: "license",
      title: "Content License",
      content: `When you upload content to ImageGenHub, you grant us a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any and all media or distribution methods (now known or later developed). You agree that this license includes the right for us to make your content available to other users of the Service, who may also use your content subject to these Terms. ImageGenHub has the right but not the obligation to monitor and edit all Content provided by users.`
    },
    {
      id: "copyright",
      title: "Copyright Policy",
      content: `We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Service infringes the copyright or other intellectual property rights of any person. If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to copyright@imagegenhub.com, with the subject line: "Copyright Infringement" and include a detailed description of the alleged infringement.`
    },
    {
      id: "termination",
      title: "Termination",
      content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service, or you may delete your account through your account settings.`
    },
    {
      id: "limitation",
      title: "Limitation Of Liability",
      content: `In no event shall ImageGenHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.`
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      content: `Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance. ImageGenHub, its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.`
    },
    {
      id: "governing-law",
      title: "Governing Law",
      content: `These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.`
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.`
    }
  ];
  
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
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div 
            className="mb-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-lg font-medium mb-4">Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {sections.map((section, index) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {index + 1}. {section.title}
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {sections.map((section) => (
              <motion.div 
                key={section.id}
                variants={itemVariants}
                id={section.id}
                className="scroll-mt-24"
              >
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="text-gray-600 dark:text-gray-400 space-y-4">
                  {section.content.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="space-y-2 mb-6">
              <p>
                <strong>Email:</strong> terms@imagegenhub.com
              </p>
              <p>
                <strong>Address:</strong> 123 Creative Ave, San Francisco, CA 94103, USA
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <Link to="/privacy">Privacy Policy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/help">Help Center</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
