import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  LayoutDashboard,
  User,
  MessageSquare,
  ShoppingBag,
  PlusCircle,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) {
    navigate('/login', { state: { from: location } });
    return null;
  }

  const mainMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: ShoppingBag, label: 'My Listings', path: '/dashboard/listings' },
    { icon: PlusCircle, label: 'Create Listing', path: '/dashboard/create-listing' },
    { icon: DollarSign, label: 'Earnings', path: '/dashboard/earnings' },
  ];

  const settingsMenuItems = [
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/support' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-[#111111] transition-all duration-300 ease-in-out z-50 shadow-lg border-r border-[#FFD700]/20",
          isExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* User Profile Section */}
        <div className={cn(
          "flex flex-col items-center gap-2 p-3 mb-6 mt-2 border-b border-[#FFD700]/20",
          isExpanded ? "px-4" : "justify-center"
        )}>
          <Avatar className="h-12 w-12 ring-2 ring-[#FFD700]">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-[#FFD700] text-black font-semibold">
              {user.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isExpanded && (
            <div className="text-center">
              <p className="text-sm font-medium text-white truncate">
                {user.username}
              </p>
              <span className="px-2 py-1 text-xs bg-[#FFD700] text-black font-medium rounded-full">
                Seller
              </span>
              <button className="mt-1 text-xs text-white hover:text-[#FFD700] transition-colors">
                View public profile
              </button>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div className="px-2">
          <div className={cn("mb-2", isExpanded && "px-3")}>
            <p className="text-xs font-medium text-[#FFD700]">Main</p>
          </div>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "text-black bg-[#FFD700]"
                      : "text-white hover:text-black hover:bg-[#FFD700]"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-black" : "text-white group-hover:text-black"
                  )} />
                  {isExpanded && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!isExpanded && (
                    <div className="absolute left-14 px-2 py-1 bg-[#111111] border border-[#FFD700]/20 rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 text-white">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Settings Navigation */}
          <div className={cn("mt-8 mb-2", isExpanded && "px-3")}>
            <p className="text-xs font-medium text-[#FFD700]">Settings</p>
          </div>
          <nav className="space-y-1">
            {settingsMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive
                      ? "text-black bg-[#FFD700]"
                      : "text-white hover:text-black hover:bg-[#FFD700]"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-black" : "text-white group-hover:text-black"
                  )} />
                  {isExpanded && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!isExpanded && (
                    <div className="absolute left-14 px-2 py-1 bg-[#111111] border border-[#FFD700]/20 rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 text-white">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className={cn(
          "p-2 mt-auto mb-4 border-t border-[#FFD700]/20",
          isExpanded ? "px-4" : "px-2"
        )}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-white hover:text-black hover:bg-[#FFD700] rounded-lg transition-all duration-200 group relative",
              !isExpanded && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span>Sign Out</span>}
            {!isExpanded && (
              <div className="absolute left-14 px-2 py-1 bg-[#111111] border border-[#FFD700]/20 rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 text-white">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden bg-black",
        isExpanded ? "ml-64" : "ml-16"
      )}>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="h-full rounded-xl bg-[#111111] p-6 shadow-lg border border-[#FFD700]/20">
            <style jsx global>{`
              h1 {
                color: #FFD700;
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1.5rem;
              }
              h2 {
                color: #FFD700;
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
              }
              h3 {
                color: #FFD700;
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
              }
              .section-title {
                color: #FFD700;
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1rem;
              }
            `}</style>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
