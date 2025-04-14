
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Log the 404 error for analytics
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check for auth error parameters in URL
    const url = new URL(window.location.href);
    const errorDescription = url.hash.match(/error_description=([^&]*)/);
    
    if (errorDescription && errorDescription[1]) {
      const decodedError = decodeURIComponent(errorDescription[1].replace(/\+/g, ' '));
      setAuthError(decodedError);
      toast.error(decodedError);
      
      // Remove the error from the URL
      const cleanUrl = window.location.href.split('#')[0];
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    }
  }, [location.pathname, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Helmet>
        <title>Page Not Found | Fortnite Marketplace</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
      </Helmet>
      
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 dark:text-white">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">Page Not Found</p>
        {authError ? (
          <div className="mb-6">
            <p className="text-red-500 mb-2">{authError}</p>
            <p className="text-gray-500 dark:text-gray-400">You'll be redirected to the login page shortly.</p>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        )}
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search for Fortnite accounts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Search Marketplace</Button>
        </form>
        
        <div className="flex flex-col space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/marketplace">
              Browse Marketplace
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
