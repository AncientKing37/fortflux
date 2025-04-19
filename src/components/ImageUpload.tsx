import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  maxSize?: number; // in bytes, default is 5MB
  className?: string;
}

export function ImageUpload({ onImageUpload, maxSize = 5 * 1024 * 1024, className }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxSize,
    multiple: false,
  });

  const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        isDragActive ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-yellow-500',
        isDragReject && 'border-red-500 bg-red-50',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <ImageIcon className={cn(
          'w-12 h-12 mb-4',
          isDragActive ? 'text-yellow-500' : 'text-gray-400',
          isDragReject && 'text-red-500'
        )} />
        <p className="mb-2 text-sm text-gray-500">
          {isDragActive ? (
            <span className="text-yellow-500">Drop the image here</span>
          ) : (
            <span>Drag and drop an image, or <span className="text-yellow-500">click to select</span></span>
          )}
        </p>
        <p className="text-xs text-gray-500">
          JPEG, PNG, or WebP (max. {Math.round(maxSize / 1024 / 1024)}MB)
        </p>
        {isFileTooLarge && (
          <p className="mt-2 text-sm text-red-500">
            File is too large. Max size is {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        )}
      </div>
    </div>
  );
} 