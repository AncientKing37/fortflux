
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import ProfileSideCard from '@/components/profile/ProfileSideCard';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import { Card } from '@/components/ui/card';

const ProfilePage = () => {
  const { user, updateProfile, becomeASeller } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  
  const [username, setUsername] = useState(user?.username || '');
  const [description, setDescription] = useState(user?.description || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  if (!user) return null;

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-50">Your Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Left column - Avatar and basic info */}
        <div className="space-y-6">
          <ProfileSideCard 
            user={user}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            isEditing={isEditing}
            updateUserProfile={updateProfile}
            becomeASeller={becomeASeller}
          />
          
          <Card className="p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Account Type</span>
                <span className="font-medium capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Joined</span>
                <span className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              {user.role === 'seller' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Listings</span>
                  <span className="font-medium">{0}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Right column - Profile details */}
        <ProfileInfoCard 
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          username={username}
          setUsername={setUsername}
          description={description}
          setDescription={setDescription}
          updateUserProfile={updateProfile}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
