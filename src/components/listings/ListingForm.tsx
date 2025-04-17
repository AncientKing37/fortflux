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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  platform: z.enum(["pc", "ps4", "ps5", "xbox", "switch"], {
    required_error: "Please select a platform",
  }),
  lastActivity: z.date({
    required_error: "Please select a date",
  }),
  epicUsername: z.string().min(3, "Username must be at least 3 characters").max(32, "Username must be at most 32 characters"),
  emailDomain: z.string()
    .min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/, "Please enter a valid domain (e.g., gmail.com, outlook.com)")
    .optional(),
  isEmailChangeable: z.boolean().default(false),
  skinCount: z.coerce.number().min(0, "Cannot be negative"),
  battlePassLevel: z.coerce.number().min(0, "Cannot be negative").max(200),
  vBucks: z.coerce.number().min(0, "Cannot be negative"),
  hasRareSkins: z.boolean().default(false),
  hasOGSkins: z.boolean().default(false),
  hasExclusiveSkins: z.boolean().default(false),
  accountCreationYear: z.coerce.number()
    .min(2017, "Fortnite was released in 2017")
    .max(new Date().getFullYear()),
  email: z.string().email("Invalid email format").optional(),
  images: z.any().optional(),
  hasSaveTheWorld: z.boolean().default(false),
  stwPowerLevel: z.coerce.number().min(0, "Cannot be negative").optional(),
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
      platform: 'pc',
      lastActivity: new Date(),
      epicUsername: '',
      emailDomain: '',
      isEmailChangeable: false,
      skinCount: 0,
      battlePassLevel: 0,
      vBucks: 0,
      hasRareSkins: false,
      hasOGSkins: false,
      hasExclusiveSkins: false,
      accountCreationYear: 2017,
      hasSaveTheWorld: false,
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
      const imageUrls = await uploadImages(user.id);
      
      const { error } = await supabase
        .from('fortnite_accounts')
        .insert({
          seller_id: user.id,
          title: data.title,
          description: data.description,
          price: data.price,
          images: imageUrls,
          status: 'pending_approval',
          platform: data.platform,
          last_activity: data.lastActivity.toISOString(),
          epic_username: data.epicUsername,
          email_domain: data.emailDomain,
          is_email_changeable: data.isEmailChangeable,
          skin_count: data.skinCount,
          battle_pass_level: data.battlePassLevel,
          v_bucks: data.vBucks,
          has_rare_skins: data.hasRareSkins,
          has_og_skins: data.hasOGSkins,
          has_exclusive_skins: data.hasExclusiveSkins,
          account_creation_year: data.accountCreationYear,
          contact_email: data.email,
          has_save_the_world: data.hasSaveTheWorld,
          stw_power_level: data.stwPowerLevel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Listing submitted for approval!");
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
            {/* Basic Information */}
            <div className="space-y-4">
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

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pc">PC</SelectItem>
                        <SelectItem value="ps4">PlayStation 4</SelectItem>
                        <SelectItem value="ps5">PlayStation 5</SelectItem>
                        <SelectItem value="xbox">Xbox</SelectItem>
                        <SelectItem value="switch">Nintendo Switch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the platform this account is primarily used on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="epicUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Epic Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter Epic Games username"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The current Epic Games username of the account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Email Domain</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., gmail.com, outlook.com"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The email domain associated with the account (without @ symbol)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isEmailChangeable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-gray-50 p-4 rounded-lg cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <div 
                      className="space-y-1 leading-none flex-1"
                      onClick={() => field.onChange(!field.value)}
                    >
                      <FormLabel className="cursor-pointer">
                        Email Changeable
                      </FormLabel>
                      <FormDescription>
                        Can the email address be changed after purchase?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Activity</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2017-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When was the last time this account was active?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountCreationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Creation Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2017" 
                        min="2017"
                        max={new Date().getFullYear()}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Year the account was created
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skinCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Skins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Total number of skins owned
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="battlePassLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Battle Pass Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        min="0"
                        max="200"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Current season's battle pass level
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
                        placeholder="1000" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Current V-Bucks balance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name="hasSaveTheWorld"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Has Save the World
                        </FormLabel>
                        <FormDescription>
                          Account includes Save the World mode
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stwPowerLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Save the World Power Level</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="131" 
                          min="0"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Current power level in Save the World
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name="hasRareSkins"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Has Rare Skins
                        </FormLabel>
                        <FormDescription>
                          Account includes rare or limited-time skins
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasOGSkins"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Has OG Skins
                        </FormLabel>
                        <FormDescription>
                          Account includes original/OG skins from early seasons
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasExclusiveSkins"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Has Exclusive Skins
                        </FormLabel>
                        <FormDescription>
                          Account includes platform-exclusive or promotional skins
                        </FormDescription>
                      </div>
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
                        placeholder="Describe your account in detail. List notable skins, achievements, battle pass history, and any other relevant information. Be specific about rare or exclusive items."
                        className="min-h-[200px]"
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

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="contact@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Alternative contact email for this listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-6">
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                    Upload Account Screenshots (Max 5)
                  </label>
                  <p className="text-xs text-gray-500">
                    Include locker screenshots, rare skins, and account stats. PNG, JPG up to 5MB each
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
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ListingForm;
