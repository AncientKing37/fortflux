
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';

interface ListingDescriptionProps {
  description: string;
  createdAt: string;
}

const ListingDescription: React.FC<ListingDescriptionProps> = ({ description, createdAt }) => {
  return (
    <Tabs defaultValue="description" className="bg-white rounded-lg shadow-md p-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="pt-4">
        <p className="whitespace-pre-line">{description}</p>
      </TabsContent>
      <TabsContent value="details" className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-sm">
              Listed on {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ListingDescription;
