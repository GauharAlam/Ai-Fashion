import React, { useRef, useState } from 'react';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  currentImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasImage = currentImage && currentImage.includes('base64');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div 
      className={`w-full aspect-square rounded-full relative flex flex-col items-center justify-center text-center p-2 cursor-pointer transition-all duration-300
        ${hasImage 
          ? 'border-0 shadow-lg' 
          : 'border-2 border-dashed hover:border-pink-500 hover:bg-gray-100 dark:hover:bg-gray-800/30'}
        ${isDragging 
          ? 'border-pink-500 ring-4 ring-pink-500/30' 
          : 'border-gray-400 dark:border-gray-600'}`
        }
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {hasImage ? (
        <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover rounded-full" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
          <CameraIcon className="h-12 w-12" />
          <p className="font-semibold">Upload Your Photo</p>
          <p className="text-sm">Click or drag & drop</p>
        </div>
      )}

      {isDragging && !hasImage && (
        <div className="absolute inset-0 rounded-full bg-pink-500/10 backdrop-blur-sm flex items-center justify-center">
            <p className="font-bold text-lg text-pink-500">Drop photo to upload</p>
        </div>
      )}
    </div>
  );
};