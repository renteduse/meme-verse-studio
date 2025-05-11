
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  className?: string;
  footerPadding?: boolean; // Add option to enable padding before footer
}

const MainLayout = ({ 
  children, 
  hideFooter = false, 
  className = "",
  footerPadding = true // Default to true for spacing before footer
}: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${className}`}>{children}</main>
      {!hideFooter && (
        <>
          {footerPadding && <div className="py-8" />}  {/* Spacing before footer if enabled */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default MainLayout;
