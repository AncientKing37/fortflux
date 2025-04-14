
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  skins: z.coerce.number().int().positive(),
  vBucks: z.coerce.number().int().nonnegative(),
  battlePass: z.boolean().default(false),
  level: z.coerce.number().int().positive(),
  featured: z.boolean().default(false),
  images: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ListingForm: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      rarity: 'rare',
      skins: 0,
      vBucks: 0,
      battlePass: false,
      level: 1,
      featured: false,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedImages = Array.from(files);
    if (selectedImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // Validate file types and sizes
    const validImages = selectedImages.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isImage) {
        toast.error(`${file.name} is not an image`);
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 5MB limit`);
      }
      
      return isImage && isValidSize;
    });

    setImages(validImages);
  };

  const uploadImages = async (userId: string): Promise<string[]> => {
    if (!images.length) return [];
    
    const imageUrls: string[] = [];
    
    try {
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${userId}/${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('fortnite_accounts')
          .upload(filePath, image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('fortnite_accounts')
          .getPublicUrl(filePath);
          
        imageUrls.push(data.publicUrl);
      }
      return imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }

    try {
      setUploading(true);
      // Upload images first
      const imageUrls = await uploadImages(user.id);
      
      // Now create the listing
      const { error } = await supabase
        .from('fortnite_accounts')
        .insert({
          seller_id: user.id,
          title: data.title,
          description: data.description,
          price: data.price,
          rarity: data.rarity,
          skins: data.skins,
          v_bucks: data.vBucks,
          battle_pass: data.battlePass,
          level: data.level,
          featured: data.featured,
          images: imageUrls
        });
        
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Listing created successfully!");
      navigate("/dashboard/listings");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.error(error.message || "Failed to create listing. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Fortnite Account Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Rare Fortnite Account with 50+ Skins" {...field} />
                    </FormControl>
                    <FormDescription>
                      Create an attractive title for your account listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="99.99" 
                        min="0" 
                        step="0.01"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Set a competitive price for your account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your account in detail. Include notable skins, achievements, and account history."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about your account's contents
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Rarity</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="uncommon">Uncommon</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the overall rarity of your account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Skins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      How many skins does this account have?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vBucks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>V-Bucks Balance</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Current V-Bucks balance on the account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        min="1"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Current account level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="battlePass"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Battle Pass</FormLabel>
                        <FormDescription>
                          Does this account have an active Battle Pass?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Feature Listing</FormLabel>
                        <FormDescription>
                          List this account as featured (premium fee applies)
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                    Upload Images (Max 5)
                  </label>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{images.length} images selected</p>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {images.map((image, index) => (
                      <div 
                        key={index}
                        className="relative h-16 w-16 rounded border overflow-hidden"
                      >
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Preview ${index}`} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/listings")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ListingForm;
