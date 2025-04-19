import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
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
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { notificationService, Notification } from '@/services/supabaseService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let isSubscribed = false;

    const setupRealtimeSubscription = async () => {
      if (!user || isSubscribed) return;

      try {
        // Fetch initial notifications
        await fetchNotifications();

        // Set up real-time subscription
        channel = supabase
          .channel(`notifications:${user.id}`, {
            config: {
              broadcast: { ack: true }
            }
          })
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              const newNotification = {
                id: payload.new.id,
                userId: payload.new.user_id,
                type: payload.new.type,
                title: payload.new.title,
                content: payload.new.content,
                read: payload.new.read,
                createdAt: new Date(payload.new.created_at),
                metadata: payload.new.metadata
              };
              setNotifications(prev => [newNotification, ...prev]);
              if (!newNotification.read) {
                setUnreadCount(count => count + 1);
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              const updatedNotification = {
                id: payload.new.id,
                userId: payload.new.user_id,
                type: payload.new.type,
                title: payload.new.title,
                content: payload.new.content,
                read: payload.new.read,
                createdAt: new Date(payload.new.created_at),
                metadata: payload.new.metadata
              };
              setNotifications(prev => 
                prev.map(notif => 
                  notif.id === updatedNotification.id ? updatedNotification : notif
                )
              );
              calculateUnreadCount();
            }
          );

        const { error } = await channel.subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to notifications channel');
            isSubscribed = true;
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.error('Channel error or closed:', err);
            isSubscribed = false;
            // Attempt to resubscribe after a delay
            setTimeout(() => {
              if (channel) {
                channel.unsubscribe();
                setupRealtimeSubscription();
              }
            }, 5000);
          }
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
        isSubscribed = false;
      }
    };

    setupRealtimeSubscription();

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (channel) {
        console.log('Cleaning up notification channel subscription');
        channel.unsubscribe();
        channel = null;
      }
    };
  }, [user]); // Only re-run if user changes
  
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const fetchedNotifications = await notificationService.getNotifications(user.id, 10);
      setNotifications(fetchedNotifications);
      calculateUnreadCount(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateUnreadCount = (notifs = notifications) => {
    const count = notifs.filter(notif => !notif.read).length;
    setUnreadCount(count);
  };
  
  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    const success = await notificationService.markAsRead(notificationId, user.id);
    
    if (success) {
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      calculateUnreadCount();
    }
  };
  
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    const success = await notificationService.markAllAsRead(user.id);
    
    if (success) {
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return 'M';
      case 'transaction':
        return 'T';
      case 'listing':
        return 'L';
      case 'wallet':
        return 'W';
      default:
        return 'N';
    }
  };
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  if (!user) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-auto">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications yet</div>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem 
              key={notification.id}
              className={cn(
                "flex items-start p-3 cursor-default",
                !notification.read && "bg-gray-50"
              )}
              onSelect={e => e.preventDefault()}
            >
              <Avatar className="h-8 w-8 mr-3 mt-1">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getNotificationIcon(notification.type)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm truncate">{notification.title}</p>
                  <div className="flex items-center ml-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{notification.content}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
