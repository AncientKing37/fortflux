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
  AlertCircle,
  CheckCircle,
  Lock,
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

type MenuItemStyle = {
  base: string;
  active: string;
};

const menuItemStyles: MenuItemStyle = {
  base: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-yellow-50 hover:text-yellow-900 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-50",
  active: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-50"
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!user) {
      if (!location.pathname.includes('admin-login')) {
        navigate('/admin-login');
      }
      return;
    }
    
    if (!['admin', 'escrow', 'support'].includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate, location.pathname]);

  if (!user && !location.pathname.includes('admin-login')) {
    return null;
  }

  if (user && !['admin', 'escrow', 'support'].includes(user.role)) {
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
      <div className="min-h-screen flex w-full flex-col bg-[#fafafa] dark:bg-black">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar variant="floating" className="border-r border-yellow-500/20 bg-white/80 backdrop-blur-sm dark:bg-black/80">
            <SidebarHeader className="flex flex-col items-center justify-center pt-6 pb-2">
              <div className="flex flex-col items-center w-full px-4 mb-4">
                <Link to="/" className="text-2xl font-bold text-yellow-500 hover:text-yellow-600 transition-colors">
                  FortFlux Admin
                </Link>
              </div>
              <Link to="/admin/profile">
                <Avatar className="h-16 w-16 mb-2 cursor-pointer ring-2 ring-white dark:ring-white/20 hover:ring-yellow-500 dark:hover:ring-yellow-500 transition-all">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-white text-yellow-500 text-xl border-2 border-yellow-500">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <p className="text-lg font-medium text-black dark:text-white">{user.username}</p>
              <div className="capitalize px-3 py-1 bg-white shadow-sm dark:bg-white/10 rounded-full text-xs font-medium mt-1 text-yellow-500">
                {user.role}
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-black/40 dark:text-white/40 font-medium uppercase text-xs tracking-wider">Dashboard</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="bg-white/50 dark:bg-white/5 rounded-lg mx-2 p-1.5">
                    {commonItems.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton 
                          asChild 
                          className={
                            location.pathname === item.path 
                              ? menuItemStyles.active 
                              : menuItemStyles.base
                          }
                        >
                          <Link to={item.path} className="flex items-center whitespace-nowrap overflow-hidden rounded-md px-2 py-1.5">
                            <item.icon className="h-4 w-4 mr-2 text-yellow-500/70 dark:text-yellow-400/70 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {moderationItems.length > 0 && (
                <SidebarGroup className="mt-6">
                  <SidebarGroupLabel className="text-black/40 dark:text-white/40 font-medium uppercase text-xs tracking-wider">Moderation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="bg-white/50 dark:bg-white/5 rounded-lg mx-2 p-1.5">
                      {moderationItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton 
                            asChild 
                            className={
                              location.pathname === item.path 
                                ? menuItemStyles.active 
                                : menuItemStyles.base
                            }
                          >
                            <Link to={item.path} className="flex items-center whitespace-nowrap overflow-hidden rounded-md px-2 py-1.5">
                              <item.icon className="h-4 w-4 mr-2 text-yellow-500/70 dark:text-yellow-400/70 flex-shrink-0" />
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
                <SidebarGroup className="mt-6">
                  <SidebarGroupLabel className="text-black/40 dark:text-white/40 font-medium uppercase text-xs tracking-wider">Payments & Escrow</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="bg-white/50 dark:bg-white/5 rounded-lg mx-2 p-1.5">
                      {paymentsItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton 
                            asChild 
                            className={
                              location.pathname === item.path 
                                ? menuItemStyles.active 
                                : menuItemStyles.base
                            }
                          >
                            <Link to={item.path} className="flex items-center whitespace-nowrap overflow-hidden rounded-md px-2 py-1.5">
                              <item.icon className="h-4 w-4 mr-2 text-yellow-500/70 dark:text-yellow-400/70 flex-shrink-0" />
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
                <SidebarGroup className="mt-6">
                  <SidebarGroupLabel className="text-black/40 dark:text-white/40 font-medium uppercase text-xs tracking-wider">Analytics</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="bg-white/50 dark:bg-white/5 rounded-lg mx-2 p-1.5">
                      {analyticsItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton 
                            asChild 
                            className={
                              location.pathname === item.path 
                                ? menuItemStyles.active 
                                : menuItemStyles.base
                            }
                          >
                            <Link to={item.path} className="flex items-center whitespace-nowrap overflow-hidden rounded-md px-2 py-1.5">
                              <item.icon className="h-4 w-4 mr-2 text-yellow-500/70 dark:text-yellow-400/70 flex-shrink-0" />
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
                <SidebarGroup className="mt-6">
                  <SidebarGroupLabel className="text-black/40 dark:text-white/40 font-medium uppercase text-xs tracking-wider">Notifications</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="bg-white/50 dark:bg-white/5 rounded-lg mx-2 p-1.5">
                      {notificationsItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton 
                            asChild 
                            className={
                              location.pathname === item.path 
                                ? menuItemStyles.active 
                                : menuItemStyles.base
                            }
                          >
                            <Link to={item.path} className="flex items-center whitespace-nowrap overflow-hidden rounded-md px-2 py-1.5">
                              <item.icon className="h-4 w-4 mr-2 text-yellow-500/70 dark:text-yellow-400/70 flex-shrink-0" />
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
                <SidebarGroup className="mt-6">
                  <SidebarGroupLabel className="text-black/40 dark:text-white/40 font-medium uppercase text-xs tracking-wider">Settings</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="bg-white/50 dark:bg-white/5 rounded-lg mx-2 p-1.5">
                      {rolesItems.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          <SidebarMenuButton 
                            asChild 
                            className={
                              location.pathname === item.path 
                                ? menuItemStyles.active 
                                : menuItemStyles.base
                            }
                          >
                            <Link to={item.path} className="flex items-center whitespace-nowrap overflow-hidden rounded-md px-2 py-1.5">
                              <item.icon className="h-4 w-4 mr-2 text-yellow-500/70 dark:text-yellow-400/70 flex-shrink-0" />
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
            
            <SidebarFooter className="p-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start bg-white/50 dark:bg-white/5 text-black/80 hover:text-yellow-500 hover:bg-white dark:text-white/80 dark:hover:bg-white/10 rounded-lg"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2 text-yellow-500/70 dark:text-yellow-400/70 flex-shrink-0" />
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
