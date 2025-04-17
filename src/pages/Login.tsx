import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const { login, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'discord' | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { success, error } = await login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        // Navigation will be handled by the useEffect above
      } else {
        toast.error(error || "Login failed. Please check your credentials.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
    try {
      setSocialLoading(provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error(`${provider} login failed: ${error.message}`);
      }
    } catch (error: any) {
      toast.error(`${provider} login failed: ${error.message}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c1f]/60 via-[#1a1c1f]/60 to-[#1E1E1E]/60 z-0"></div>
      <div className="absolute inset-0 bg-[url('/bg-pattern.jpg')] bg-cover bg-center z-[-1]"></div>
      <Card className="w-full max-w-md shadow-xl bg-white/90 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Log in to your account to access the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : "Log In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 bg-white">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('google')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('discord')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'discord' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                  />
                </svg>
              )}
              Discord
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-500 hover:text-yellow-400 hover:underline">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
