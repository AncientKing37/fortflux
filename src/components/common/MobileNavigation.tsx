import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare,
  User,
  ShoppingBag,
  FileText,
  Shield,
  DollarSign,
  HeadphonesIcon,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  
  if (!user) return null;
  
  // Define routes based on user role
  const getRoutes = () => {
    const basePath = user.role === 'admin' || user.role === 'escrow' || user.role === 'support' 
      ? '/admin' 
      : '/dashboard';
      
    const commonRoutes = [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: basePath,
      },
      {
        icon: MessageSquare,
        label: 'Messages',
        path: `${basePath === '/admin' ? '/dashboard' : basePath}/messages`,
      },
      {
        icon: User,
        label: 'Profile',
        path: `${basePath}/profile`,
      },
    ];
    
    switch (user.role) {
      case 'buyer':
        return [
          ...commonRoutes,
          {
            icon: ShoppingBag,
            label: 'Purchases',
            path: '/dashboard/purchases',
          },
        ];
      case 'seller':
        return [
          ...commonRoutes,
          {
            icon: FileText,
            label: 'Listings',
            path: '/dashboard/listings',
          },
        ];
      case 'admin':
        return [
          ...commonRoutes,
          {
            icon: Shield,
            label: 'Disputes',
            path: '/admin/disputes',
          },
        ];
      case 'escrow':
        return [
          ...commonRoutes,
          {
            icon: DollarSign,
            label: 'Escrow',
            path: '/admin/escrow-queue',
          },
        ];
      case 'support':
        return [
          ...commonRoutes,
          {
            icon: HeadphonesIcon,
            label: 'Support',
            path: '/dashboard/support',
          },
        ];
      default:
        return commonRoutes;
    }
  };
  
  const routes = getRoutes();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 shadow-lg border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {routes.slice(0, 3).map((route) => (
          <Link 
            key={route.path}
            to={route.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full px-1",
              location.pathname === route.path
                ? "text-yellow-500"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <route.icon className={cn(
              "h-5 w-5 mb-1",
              location.pathname === route.path
                ? "text-yellow-500"
                : "text-gray-500 dark:text-gray-400"
            )} />
            <span className="text-xs truncate max-w-[80px] text-center">{route.label}</span>
          </Link>
        ))}
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                open ? "text-yellow-500" : "text-gray-500 dark:text-gray-400"
              )}
            >
              {open ? (
                <X className="h-5 w-5 mb-1" />
              ) : (
                <Menu className="h-5 w-5 mb-1" />
              )}
              <span className="text-xs">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] bg-white dark:bg-gray-950 p-0">
            <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
              <SheetTitle className="text-left text-yellow-500">Menu</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800",
                    location.pathname === route.path
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  <route.icon className="h-5 w-5 mr-3" />
                  <span>{route.label}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavigation;
