
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// User type
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
}

// Auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: User) => void;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Set default axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Check if token is valid
          const response = await axios.get('http://localhost:5000/api/auth/me');
          
          if (response.data.success) {
            setIsAuthenticated(true);
            setUser({
              id: response.data.user._id,
              username: response.data.user.username,
              email: response.data.user.email,
              avatar: response.data.user.avatar,
              displayName: response.data.user.displayName,
              bio: response.data.user.bio,
              location: response.data.user.location,
              website: response.data.user.website
            });
            setToken(storedToken);
          } else {
            // Token is invalid, clear localStorage
            handleLogout();
          }
        } catch (error) {
          console.error('Auth error:', error);
          handleLogout();
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Set token to localStorage
        localStorage.setItem('token', token);
        
        // Set default axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setIsAuthenticated(true);
        setUser({
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          displayName: user.displayName,
          bio: user.bio,
          location: user.location,
          website: user.website
        });
        setToken(token);
        
        return true;
      } else {
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });

      if (response.data.success) {
        toast.success('Registration successful! Please log in.');
        return true;
      } else {
        toast.error(response.data.message || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    
    // Remove axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  // Update user data
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      login,
      register,
      logout: handleLogout,
      updateUser,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
