
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  className?: string;
}

const MainLayout = ({ children, hideFooter = false, className = "" }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${className}`}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
