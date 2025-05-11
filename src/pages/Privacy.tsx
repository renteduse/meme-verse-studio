
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  // Last updated date
  const lastUpdated = "May 10, 2025";
  
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `At ImageGenHub, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.`
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      content: `We collect information that you provide directly to us when you register for an account, create or modify your profile, and use features of our platform. This information may include:

• Name and contact details (such as email address)
• Username and password
• Profile information, including biography and profile picture
• Content you upload, publish, or share
• Communications you send to us
• Payment information (if applicable)

We also collect information automatically when you use our service:

• Log and usage data (such as IP address, device information, browser type)
• Location information
• Cookies and similar tracking technologies
• Usage patterns and preferences`
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      content: `We use the information we collect for various purposes, including:

• Providing, maintaining, and improving our services
• Processing and completing transactions
• Sending you technical notices, updates, security alerts, and administrative messages
• Responding to your comments, questions, and requests
• Monitoring and analyzing trends, usage, and activities
• Personalizing your experience
• Protecting against, identifying, and preventing fraud and other illegal activity
• Enforcing our Terms of Service`
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      content: `We may share your information in the following situations:

• With other users (for publicly shared content)
• With vendors, service providers, and other partners who need access to such information to carry out work on our behalf
• In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process
• If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of ImageGenHub or others
• In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company
• With your consent or at your direction`
    },
    {
      id: "data-security",
      title: "Data Security",
      content: `We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free. In particular, email sent to or from our Services may not be secure. Therefore, you should take special care in deciding what information you send to us via the internet.`
    },
    {
      id: "cookies-and-tracking",
      title: "Cookies and Tracking Technologies",
      content: `We and our third-party partners may use cookies, web beacons, and other similar technologies on our services. These technologies help us better understand user behavior, tell us which parts of our website people have visited, and facilitate and measure the effectiveness of advertisements and web searches. We treat information collected by cookies and other technologies as non-personal information.

You can configure your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our services may not function properly without cookies.`
    },
    {
      id: "children",
      title: "Children's Privacy",
      content: `Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete that information as quickly as possible. If you believe we have any information from a child under 13, please contact us.`
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      content: `You have certain rights regarding the personal information we hold about you, subject to local law. These may include:

• The right to access, correct, update, or request deletion of your personal information
• The right to object to processing of your personal information
• The right to opt-out of marketing communications
• The right to data portability
• The right to complain to a data protection authority

To exercise these rights, please contact us at privacy@imagegenhub.com.`
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the service or by other means, such as email. We encourage you to review the Privacy Policy whenever you access our services to stay informed about our information practices and the choices available to you.`
    },
    {
      id: "international-data-transfers",
      title: "International Data Transfers",
      content: `We operate globally and may transfer your personal information to countries other than the one in which you live. We employ appropriate safeguards to ensure your data remains protected wherever it is transferred.`
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
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
                    <div key={i} className="space-y-2">
                      {paragraph.split('\n').map((line, j) => (
                        <p key={j}>{line}</p>
                      ))}
                    </div>
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
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2 mb-6">
              <p>
                <strong>Email:</strong> privacy@imagegenhub.com
              </p>
              <p>
                <strong>Address:</strong> 123 Creative Ave, San Francisco, CA 94103, USA
              </p>
              <p>
                <strong>Data Protection Officer:</strong> dpo@imagegenhub.com
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <Link to="/terms">Terms of Service</Link>
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

export default Privacy;
