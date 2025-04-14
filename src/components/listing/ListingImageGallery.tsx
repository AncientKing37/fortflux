
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface ListingImageGalleryProps {
  images: string[];
  title: string;
}

const ListingImageGallery: React.FC<ListingImageGalleryProps> = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState<string | null>(
    images && images.length > 0 ? images[0] : null
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        {activeImage ? (
          <img 
            src={activeImage} 
            alt={title} 
            className="w-full h-auto max-h-[500px] object-contain"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>
      
      {images && images.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingImageGallery;
