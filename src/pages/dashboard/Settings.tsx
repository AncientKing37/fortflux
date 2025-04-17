import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import WalletSettings from '@/components/profile/WalletSettings';
import { EmailChangeForm } from '@/components/EmailChangeForm';
import type { User } from '@/types';

const SettingsPage = () => {
  const { user, updateProfile } = useUser();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [description, setDescription] = useState(user?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const result = await updateProfile({
        ...user,
        username,
        description,
        avatar: avatarUrl
      });
      
      if (result) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleSaveEmail = () => {
    toast.success('Email preferences saved');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setAvatarUrl(data.publicUrl);
      
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-50">
        Account Settings
      </h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {user?.role === 'seller' && (
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and how you appear on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-gray-50 dark:bg-gray-800/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email is managed through your account settings
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isSaving}
                      placeholder="Tell others about yourself..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>{username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2">
                        Change Avatar
                      </span>
                      <Input 
                        id="avatar" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleAvatarUpload}
                        accept="image/*"
                      />
                    </Label>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control when and how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Messages</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new messages from buyers and sellers.</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Transaction Updates</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about changes to your transactions.</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about new features and special offers.</p>
                  </div>
                  <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Change your email address. You'll need to verify your current email first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmailChangeForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Settings</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
                
                <Button onClick={handleSaveEmail}>
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {user?.role === 'seller' && (
          <TabsContent value="wallet">
            <WalletSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
