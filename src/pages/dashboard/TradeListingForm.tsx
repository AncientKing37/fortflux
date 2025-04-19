import React, { useState } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface FormData {
  title: string;
  description: string;
  preferredItems: string;
  images: File[];
}

const TradeListingForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    preferredItems: '',
    images: [],
  });

  const handleImageUpload = (file: File) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, file],
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    navigate('/dashboard/listings');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Create Trade Listing</h1>
        <p className="text-gray-600">Fill in the details below to create your trade listing.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter a title for your listing"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your account (skins, level, achievements, etc.)"
            required
            className="h-32"
          />
        </div>

        <div>
          <Label htmlFor="preferredItems">Preferred Items</Label>
          <Textarea
            id="preferredItems"
            value={formData.preferredItems}
            onChange={e => setFormData(prev => ({ ...prev, preferredItems: e.target.value }))}
            placeholder="What are you looking to trade for? List specific items, skins, or account features you're interested in."
            required
            className="h-32"
          />
        </div>

        <div>
          <Label>Images</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            {formData.images.length < 4 && (
              <ImageUpload onImageUpload={handleImageUpload} />
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Add up to 4 images of your account (screenshots of inventory, achievements, etc.)
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard/listings')}
        >
          Cancel
        </Button>
        <Button type="submit">
          Create Listing
        </Button>
      </div>
    </form>
  );
};

export default TradeListingForm; 