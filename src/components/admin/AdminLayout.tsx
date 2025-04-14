
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  LayoutDashboard,
  Shield,
  Users,
  Flag,
  ShieldAlert,
  ClipboardCheck,
  DollarSign,
  Receipt,
  BarChart,
  Bell,
  Settings,
  LogOut,
  UserCog,
  Moon,
  Sun,
  Menu,
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from '@/components/common/MobileNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!user) {
      navigate('/admin-login');
      return;
    }
    
    if (!['admin', 'escrow', 'support'].includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || !['admin', 'escrow', 'support'].includes(user.role)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    const commonItems = [
      { 
        icon: LayoutDashboard, 
        title: 'Dashboard', 
        path: '/admin',
        allowedRoles: ['admin', 'escrow', 'support']
      },
    ];
    
    const moderationItems = [
      {
        icon: Shield,
        title: 'Disputes',
        path: '/admin/disputes',
        allowedRoles: ['admin', 'escrow']
      },
      {
        icon: ShieldAlert,
        title: 'Ban System',
        path: '/admin/bans',
        allowedRoles: ['admin']
      },
      {
        icon: ClipboardCheck,
        title: 'Listing Approval',
        path: '/admin/listings/approve',
        allowedRoles: ['admin', 'support']
      },
      {
        icon: Flag,
        title: 'Flagged Content',
        path: '/admin/flagged-content',
        allowedRoles: ['admin', 'support']
      },
    ];
    
    const paymentsItems = [
      {
        icon: Receipt,
        title: 'Escrow Queue',
        path: '/admin/escrow-queue',
        allowedRoles: ['admin', 'escrow']
      },
      {
        icon: DollarSign,
        title: 'Fees & Earnings',
        path: '/admin/fees',
        allowedRoles: ['admin']
      },
    ];
    
    const analyticsItems = [
      {
        icon: BarChart,
        title: 'Analytics',
        path: '/admin/analytics',
        allowedRoles: ['admin']
      },
    ];
    
    const notificationsItems = [
      {
        icon: Bell,
        title: 'Notifications',
        path: '/admin/notifications',
        allowedRoles: ['admin', 'support']
      },
    ];
    
    const rolesItems = [
      {
        icon: UserCog,
        title: 'Roles & Permissions',
        path: '/admin/roles',
        allowedRoles: ['admin']
      },
    ];
    
    return {
      commonItems: commonItems.filter(item => item.allowedRoles.includes(user.role)),
      moderationItems: moderationItems.filter(item => item.allowedRoles.includes(user.role)),
      paymentsItems: paymentsItems.filter(item => item.allowedRoles.includes(user.role)),
      analyticsItems: analyticsItems.filter(item => item.allowedRoles.includes(user.role)),
      notificationsItems: notificationsItems.filter(item => item.allowedRoles.includes(user.role)),
      rolesItems: rolesItems.filter(item => item.allowedRoles.includes(user.role)),
    };
  };

  const {
    commonItems,
    moderationItems,
    paymentsItems,
    analyticsItems,
    notificationsItems,
    rolesItems
  } = getNavItems();

  const menuItemStyles = {
    default: "text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800",
    active: "bg-primary/10 text-primary font-semibold dark:bg-primary/20",
  };
  
  const allItems = [
    ...commonItems,
    ...moderationItems,
    ...paymentsItems,
    ...analyticsItems,
    ...notificationsItems,
    ...rolesItems
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar variant="floating" className="border-r border-r-gray-200 dark:border-r-gray-800">
            <SidebarHeader className="flex flex-col items-center justify-center pt-6 pb-2">
              <div className="flex items-center justify-between w-full px-4 mb-4">
                <Link to="/" className="text-xl font-bold marketplace-gradient-text">
                  FortMarket Admin
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link to="/admin/profile">
                <Avatar className="h-16 w-16 mb-2 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all avatar-ring">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-marketplace-purple text-white text-xl">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <p className="text-lg font-medium dark:text-white">{user.username}</p>
              <div className="capitalize px-2 py-0.5 bg-primary/10 rounded-full text-xs font-medium mt-1 dark:bg-primary/20 dark:text-primary-foreground">
                {user.role}
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Dashboard</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {commonItems.map((item) => (
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

              {moderationItems.length > 0 && (
                <SidebarGroup className="mt-4">
                  <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Moderation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {moderationItems.map((item) => (
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
              )}

              {paymentsItems.length > 0 && (
                <SidebarGroup className="mt-4">
                  <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Payments & Escrow</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {paymentsItems.map((item) => (
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
              )}

              {analyticsItems.length > 0 && (
                <SidebarGroup className="mt-4">
                  <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Analytics</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {analyticsItems.map((item) => (
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
              )}

              {notificationsItems.length > 0 && (
                <SidebarGroup className="mt-4">
                  <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Notifications</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {notificationsItems.map((item) => (
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
              )}

              {rolesItems.length > 0 && (
                <SidebarGroup className="mt-4">
                  <SidebarGroupLabel className="text-gray-500 dark:text-gray-400">Settings</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {rolesItems.map((item) => (
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
              )}
            </SidebarContent>
            
            <SidebarFooter>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:text-red-500 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>
          
          <div className="flex-1 overflow-auto pb-16 md:pb-0 dashboard-content">
            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
        
        {isMobile && <MobileNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
