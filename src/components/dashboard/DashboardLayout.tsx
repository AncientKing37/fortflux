import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  User,
  CreditCard,
  Settings,
  Users,
  LifeBuoy,
  LogOut,
  Shield,
  PlusCircle,
  Store,
  Home,
  HeadphonesIcon,
  AlertCircle,
  Bell,
  FileText,
  DollarSign
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from '@/components/common/MobileNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!user) {
    navigate('/login', { state: { from: location } });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const commonMenuItems = [
    { icon: LayoutDashboard, title: 'Dashboard', path: '/dashboard' },
    { icon: User, title: 'Profile', path: '/dashboard/profile' },
    { icon: MessageSquare, title: 'Messages', path: '/dashboard/messages' },
  ];

  const buyerMenuItems = [
    ...commonMenuItems,
    { icon: ShoppingBag, title: 'My Purchases', path: '/dashboard/purchases' },
    { icon: CreditCard, title: 'Payment Methods', path: '/dashboard/payments' },
    { icon: Store, title: 'Become a Seller', path: '/dashboard/become-seller' },
  ];

  const sellerMenuItems = [
    ...commonMenuItems,
    { icon: ShoppingBag, title: 'My Listings', path: '/dashboard/listings' },
    { icon: PlusCircle, title: 'Create Listing', path: '/dashboard/create-listing' },
    { icon: CreditCard, title: 'Earnings', path: '/dashboard/earnings' },
  ];

  const escrowMenuItems = [
    ...commonMenuItems,
    { icon: Shield, title: 'Active Escrows', path: '/dashboard/escrows' },
    { icon: DollarSign, title: 'Release Funds', path: '/dashboard/release-funds' },
    { icon: Users, title: 'User Transactions', path: '/dashboard/transactions' },
    { icon: CreditCard, title: 'My Earnings', path: '/dashboard/escrow-earnings' },
  ];

  const supportMenuItems = [
    ...commonMenuItems,
    { icon: HeadphonesIcon, title: 'Support Dashboard', path: '/dashboard/support' },
    { icon: AlertCircle, title: 'Disputes', path: '/dashboard/disputes' },
    { icon: Bell, title: 'Send Notifications', path: '/dashboard/notifications' },
    { icon: Users, title: 'User Management', path: '/dashboard/users' },
  ];

  const adminMenuItems = [
    ...commonMenuItems,
    { icon: Shield, title: 'Admin Dashboard', path: '/admin' },
    { icon: Users, title: 'User Management', path: '/dashboard/users' },
  ];

  const getMenuItems = () => {
    switch (user.role) {
      case 'buyer': return buyerMenuItems;
      case 'seller': return sellerMenuItems;
      case 'escrow': return escrowMenuItems;
      case 'support': return supportMenuItems;
      case 'admin': return adminMenuItems;
      default: return buyerMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const menuItemStyles = {
    default: "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
    active: "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-semibold",
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="border-r border-gray-200 dark:border-gray-800">
            <SidebarHeader className="flex flex-col items-center justify-center pt-6 pb-2">
              <Link to="/" className="text-xl font-bold marketplace-gradient-text mb-4">
                FortMarket
              </Link>
              <Link to="/dashboard/profile">
                <Avatar className="h-16 w-16 mb-2 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all avatar-ring">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-marketplace-purple text-white text-xl">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <p className="text-lg font-medium dark:text-white">{user.username}</p>
              <div className="capitalize px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground rounded-full text-xs font-medium mt-1">
                {user.role}
              </div>
              
              {user.role === 'seller' && (
                <Link to={`/seller/${user.username}`} className="mt-2 text-xs text-primary hover:underline">
                  View public profile
                </Link>
              )}
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Main</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton 
                          asChild 
                          className={
                            location.pathname === item.path 
                              ? menuItemStyles.active 
                              : menuItemStyles.default
                          }
                        >
                          <Link to={item.path} className="flex items-center whitespace-nowrap overflow-hidden">
                            <item.icon className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-4">
                <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        className={
                          location.pathname === '/dashboard/settings'
                            ? menuItemStyles.active
                            : menuItemStyles.default
                        }
                      >
                        <Link to="/dashboard/settings" className="flex items-center whitespace-nowrap overflow-hidden">
                          <Settings className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <span className="truncate">Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        className={
                          location.pathname === '/dashboard/help'
                            ? menuItemStyles.active
                            : menuItemStyles.default
                        }
                      >
                        <Link to="/dashboard/help" className="flex items-center whitespace-nowrap overflow-hidden">
                          <LifeBuoy className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <span className="truncate">Help & Support</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>
          
          <div className="flex-1 overflow-auto pb-16 md:pb-0 dashboard-content">
            <div className="sticky top-0 z-10 bg-background dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="ml-4 text-xl font-bold truncate dark:text-white">
                  {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                  Return to Marketplace
                </Link>
              </div>
            </div>
            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
        
        {isMobile && <MobileNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
