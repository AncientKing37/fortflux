
import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/types';

interface AvatarUploaderProps {
  user: User;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  isEditing: boolean;
  updateUserProfile?: (data: Partial<User>) => Promise<boolean>;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  user,
  avatarUrl,
  setAvatarUrl,
  isEditing,
  updateUserProfile
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 5MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload to Supabase Storage with user ID in the path for RLS
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log('Uploading file to avatars bucket:', fileName);
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      console.log('File uploaded successfully, public URL:', publicUrl);
      
      // Update avatar in state
      setAvatarUrl(publicUrl);
      
      // If not in edit mode, save immediately
      if (!isEditing && updateUserProfile) {
        await updateUserProfile({ avatar: publicUrl });
      }
      
      toast.success('Avatar uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative mb-4 group">
      <Avatar className="w-32 h-32 border-4 border-white shadow-md">
        <AvatarImage src={avatarUrl} alt={user.username} />
        <AvatarFallback className="text-2xl bg-primary/10">
          {user.username.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <button 
        className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-md"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Camera className="h-5 w-5" />
        )}
      </button>
      
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleAvatarUpload}
      />
    </div>
  );
};

export default AvatarUploader;
