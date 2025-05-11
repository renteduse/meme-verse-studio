
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API calls for demonstration purposes
const mockLoginApi = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is where you'd normally make a POST request to your backend
  if (email === 'demo@example.com' && password === 'password') {
    return {
      id: '1',
      username: 'demouser',
      email: 'demo@example.com',
      avatar: 'https://i.pravatar.cc/150?img=32'
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegisterApi = async (username: string, email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is where you'd normally make a POST request to your backend
  return {
    id: '2',
    username,
    email,
    avatar: 'https://i.pravatar.cc/150?img=33'
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for a saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await mockLoginApi(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.username}!`);
      navigate('/feed');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await mockRegisterApi(username, email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Registration successful! Welcome to ImageGenHub!');
      navigate('/feed');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
