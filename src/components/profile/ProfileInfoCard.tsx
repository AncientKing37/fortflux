
import React, { useState } from 'react';
import { User } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';

interface ProfileInfoCardProps {
  user: User;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  description: string;
  setDescription: (description: string) => void;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  user,
  isEditing,
  setIsEditing,
  username,
  setUsername,
  description,
  setDescription,
  updateUserProfile
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setUsername(user.username);
      setDescription(user.description || '');
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      const success = await updateUserProfile({
        username,
        description
      });
      
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </div>
        <Button 
          variant={isEditing ? "outline" : "default"}
          onClick={handleEditToggle}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              value={user.email}
              disabled
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>
          
          {(user.role === 'seller' || isEditing) && (
            <div>
              <Label htmlFor="description">Seller Description</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditing}
                placeholder={isEditing ? "Tell buyers about yourself..." : "No description provided"}
                className="min-h-[120px]"
              />
            </div>
          )}
          
          {user.role === 'seller' && (
            <div>
              <Label>Account Statistics</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Listings</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Sales</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="justify-end">
          <Button 
            onClick={handleSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileInfoCard;
