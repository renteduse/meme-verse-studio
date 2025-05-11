
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Feed", path: "/feed" },
    { name: "Create", path: "/create" },
    { name: "Trending", path: "/trending" },
  ];

  const authLinks = isAuthenticated
    ? [
        { name: "My Dashboard", path: "/dashboard" },
        { name: "Settings", path: "/settings" },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Sign Up", path: "/signup" },
      ];

  const initialNavbarBg = "bg-transparent";
  const scrolledNavbarBg = "bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || location.pathname !== "/" ? scrolledNavbarBg : initialNavbarBg
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-brand-purple to-brand-indigo text-transparent bg-clip-text">
                Image
              </span>
              <span>GenHub</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === link.path ? "text-primary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
              {location.pathname !== "/signup" && (
                <Button variant="default" className="bg-gradient-to-r from-brand-purple to-brand-indigo" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col gap-4 md:hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    location.pathname === link.path ? "bg-gray-100 dark:bg-gray-800" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t my-2 border-gray-200 dark:border-gray-700"></div>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-4 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback>{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="text-sm font-medium p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <Button variant="destructive" className="mt-2" onClick={() => { logout(); closeMobileMenu(); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full" onClick={closeMobileMenu}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-to-r from-brand-purple to-brand-indigo" onClick={closeMobileMenu}>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
