
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types';
import { Camera, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSideCardProps {
  user: User;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  isEditing: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  becomeASeller: () => Promise<boolean>;
}

const ProfileSideCard: React.FC<ProfileSideCardProps> = ({
  user,
  avatarUrl,
  setAvatarUrl,
  isEditing,
  updateUserProfile,
  becomeASeller
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isBecomingSeller, setIsBecomingSeller] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // For demo, just create a blob URL (in a real app, we would upload to storage)
    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      const success = await updateUserProfile({ avatar: url });
      
      if (!success) {
        throw new Error("Failed to update profile avatar");
      }
      
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBecomeSeller = async () => {
    setIsBecomingSeller(true);
    
    try {
      const success = await becomeASeller();
      
      if (!success) {
        throw new Error("Failed to become a seller");
      }
      
      toast.success("You are now a seller!");
    } catch (error) {
      console.error("Error becoming a seller:", error);
      toast.error("Failed to become a seller");
    } finally {
      setIsBecomingSeller(false);
    }
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardContent className="p-5 flex flex-col items-center">
        <div className="mb-4 relative group">
          <Avatar className="h-32 w-32 border-4 border-white shadow-md">
            <AvatarImage src={avatarUrl} alt={user.username} />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="cursor-pointer p-2 rounded-full bg-primary/80 hover:bg-primary text-white">
                <Camera className="h-6 w-6" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-60">
              <Upload className="h-6 w-6 text-white animate-pulse" />
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mt-2 mb-1">{user.username}</h2>
        
        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-xl font-semibold text-primary">{user.vouchCount}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Vouches</div>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-xl font-semibold text-primary">${user.balance?.toFixed(2) || "0.00"}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Balance</div>
            </div>
          </div>
          
          {user.role === 'buyer' && (
            <Button 
              variant="default"
              className="w-full"
              onClick={handleBecomeSeller}
              disabled={isBecomingSeller}
            >
              {isBecomingSeller ? "Processing..." : "Become a Seller"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSideCard;
