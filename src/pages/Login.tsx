
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to feed
  if (isAuthenticated) {
    return <Navigate to="/feed" />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login helper
  const handleDemoLogin = async () => {
    setEmail("demo@example.com");
    setPassword("password");
    
    try {
      setIsLoading(true);
      setError(null);
      await login("demo@example.com", "password");
    } catch (err: any) {
      setError(err.message || "Failed to login with demo account");
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout className="bg-mesh flex items-center justify-center">
      <div className="container max-w-md px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow-xl border-0">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {error}
                  </p>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-indigo"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Demo Account
                </Button>
              </form>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Login;
