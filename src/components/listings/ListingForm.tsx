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
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  description: z.string().min(50, "Description must be at least 50 characters").max(2000),
  price: z.coerce.number().min(0, "Price must be at least 0").optional(),
  images: z.array(z.string()).optional().default([]),
  lastActivity: z.coerce.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a valid date",
  }),
  epicUsername: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(32)
    .regex(/^[a-zA-Z0-9._-]+$/, "Username can only contain letters, numbers, dots, underscores, and hyphens"),
  emailDomain: z.string()
    .min(1, "Email domain is required")
    .refine(
      (value) => !value.includes('@'),
      "Please enter only the domain part (without @ symbol)"
    )
    .refine(
      (value) => /^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/.test(value),
      "Please enter a valid domain (e.g. gmail.com)"
    ),
  canLinkTo: z.array(z.string()).optional().default([]),
  isEmailChangeable: z.boolean().default(false),
  hasStw: z.boolean().default(false),
  stwPowerLevel: z.coerce.number().min(1).max(999).optional()
    .refine(
      (val) => val === undefined || val === null || val >= 1,
      "Power level must be at least 1"
    ),
  numSkins: z.coerce.number().min(1, "Must have at least 1 skin"),
  preferredTrade: z.string().optional(),
  tradeRequirements: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ListingFormProps {
  listingType: 'sell' | 'trade';
}

const ListingForm: React.FC<ListingFormProps> = ({ listingType }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: listingType === 'sell' ? 0 : undefined,
      images: [],
      lastActivity: new Date(),
      epicUsername: "",
      emailDomain: "",
      canLinkTo: [],
      isEmailChangeable: false,
      hasStw: false,
      stwPowerLevel: 1,
      numSkins: 1,
      preferredTrade: "",
      tradeRequirements: "",
      email: "",
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
        const fileName = `${userId}/${uuidv4()}.${image.name.split('.').pop()}`;
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

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload images first
      let imageUrls: string[] = [];
      try {
        imageUrls = await uploadImages(user.id);
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload images. Please try again.');
        return;
      }

      // Prepare the listing data
      const listingData = {
        title: data.title,
        description: data.description,
        price: listingType === 'sell' ? data.price : 0,
        images: imageUrls,
        seller_id: user.id,
        status: 'pending',
        type: listingType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Submitting listing data:', listingData);
      
      const { data: listing, error } = await supabase
        .from('fortnite_accounts')
        .insert([listingData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating listing:', error);
        if (error.code === '23505') {
          toast.error('You already have a listing with this Epic username');
        } else if (error.code === '23503') {
          toast.error('Invalid user account');
        } else {
          toast.error(`Failed to create listing: ${error.message}`);
        }
        return;
      }
      
      toast.success('Listing created successfully!');
      navigate('/dashboard/listings');
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast.error(error.message || 'Failed to create listing');
    } finally {
      setIsUploading(false);
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

              {listingType === 'sell' && (
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
              )}

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
                              format(new Date(field.value), "PPP")
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
                          selected={field.value ? new Date(field.value) : undefined}
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
                name="numSkins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Skins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50" 
                        min="1"
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
                name="stwPowerLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Save the World Power Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="131" 
                        min="1"
                        max="999"
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

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name="hasStw"
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

              {listingType === 'trade' && (
                <>
                  <FormField
                    control={form.control}
                    name="preferredTrade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Trade</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what kind of account you're looking to trade for"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Specify what you're looking for in a trade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tradeRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trade Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List any specific requirements for the trade"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include any must-have features or conditions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

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
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Create ${listingType === 'sell' ? 'Sale' : 'Trade'} Listing`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ListingForm;
