import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/types';
import { LogOut, Menu, ShoppingCart, User, Shield, Settings } from 'lucide-react';
import NotificationBell from './notifications/NotificationBell';

const Navbar: React.FC = () => {
  const {
    user,
    logout
  } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Determine if user should see admin dashboard
  const isAdminRole = user && ['admin', 'escrow', 'support'].includes(user.role);
  const dashboardLink = isAdminRole ? '/admin' : '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-black border-b border-yellow-500/20 sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold text-yellow-500">
            EL1TE MP
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className={`text-gray-300 hover:text-yellow-500 font-medium transition-colors ${location.pathname === '/' ? 'text-yellow-500 font-semibold' : ''}`}>
            Home
          </Link>
          <Link to="/marketplace" className={`text-gray-300 hover:text-yellow-500 font-medium transition-colors ${location.pathname === '/marketplace' ? 'text-yellow-500 font-semibold' : ''}`}>
            Marketplace
          </Link>
          <Link to="/how-it-works" className={`text-gray-300 hover:text-yellow-500 font-medium transition-colors ${location.pathname === '/how-it-works' ? 'text-yellow-500 font-semibold' : ''}`}>
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              
              <span className="text-gray-300 font-medium hidden md:block">
                {user.username}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0 overflow-hidden hover:bg-yellow-500/20">
                    <Avatar className="h-10 w-10 transition-transform hover:scale-105 border-2 border-yellow-500">
                      <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
                      <AvatarFallback className="bg-yellow-500 text-black">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 py-2 bg-black border border-yellow-500/50">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{user.username}</span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                      <span className="text-xs font-medium mt-1 capitalize bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full w-fit">
                        {user.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-yellow-500/20" />
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-yellow-500/20 focus:text-yellow-500">
                    <Link to={dashboardLink} className="flex w-full items-center text-gray-300">
                      {isAdminRole ? (
                        <>
                          <Shield className="mr-2 h-4 w-4 text-gray-400" />
                          Admin Dashboard
                        </>
                      ) : (
                        <>
                          <User className="mr-2 h-4 w-4 text-gray-400" />
                          Dashboard
                        </>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-yellow-500/20 focus:text-yellow-500">
                    <Link to={isAdminRole ? "/admin/disputes" : "/dashboard/messages"} className="flex w-full items-center text-gray-300">
                      <ShoppingCart className="mr-2 h-4 w-4 text-gray-400" />
                      {isAdminRole ? "Disputes" : (user.role === 'buyer' ? 'My Purchases' : 'My Listings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-yellow-500/20 focus:text-yellow-500">
                    <Link to="/dashboard/settings" className="flex w-full items-center text-gray-300">
                      <Settings className="mr-2 h-4 w-4 text-gray-400" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-yellow-500/20" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-950/50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="font-medium transition-colors border-yellow-500 text-yellow-500 hover:bg-yellow-500/20">Login</Button>
              </Link>
              <Link to="/signup" className="hidden md:inline-block">
                <Button className="font-medium transition-colors bg-yellow-500 text-black hover:bg-yellow-400">Sign up</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-yellow-500 hover:bg-yellow-500/20" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-yellow-500/20 animate-fade-in">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            <Link to="/" className="py-3 text-gray-300 hover:text-yellow-500 border-b border-yellow-500/20" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/marketplace" className="py-3 text-gray-300 hover:text-yellow-500 border-b border-yellow-500/20" onClick={() => setMobileMenuOpen(false)}>
              Marketplace
            </Link>
            <Link to="/how-it-works" className="py-3 text-gray-300 hover:text-yellow-500 border-b border-yellow-500/20" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </Link>
            {user && (
              <>
                <Link to={dashboardLink} className="py-3 text-gray-300 hover:text-yellow-500 border-b border-yellow-500/20" onClick={() => setMobileMenuOpen(false)}>
                  {isAdminRole ? "Admin Dashboard" : "Dashboard"}
                </Link>
                <Link to="/dashboard/settings" className="py-3 text-gray-300 hover:text-yellow-500 border-b border-yellow-500/20" onClick={() => setMobileMenuOpen(false)}>
                  Settings
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="py-3 text-gray-300 hover:text-yellow-500 border-b border-yellow-500/20" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="py-3 text-gray-300 hover:text-yellow-500" onClick={() => setMobileMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
