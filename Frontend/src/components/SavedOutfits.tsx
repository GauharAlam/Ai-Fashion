import React from 'react';
import type { Outfit } from '../types';
import { OutfitCard } from './OutfitCard';
import { HeartIcon } from './icons/HeartIcon';

interface SavedOutfitsProps {
  savedOutfits: Outfit[];
  onToggleSave: (outfit: Outfit) => void;
  imageBase64: string;
  imageMimeType: string;
}

export const SavedOutfits: React.FC<SavedOutfitsProps> = ({ savedOutfits, onToggleSave, imageBase64, imageMimeType }) => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 dark:from-pink-400 to-violet-500 dark:to-violet-400 flex items-center justify-center gap-3">
        <HeartIcon isFilled={true} />
        Saved for Later
      </h2>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {savedOutfits.map((outfit, index) => (
            <OutfitCard
              key={`${outfit.styleTitle}-saved-${index}`}
              outfit={outfit}
              isSaved={true}
              onToggleSave={onToggleSave}
              imageBase64={imageBase64}
              imageMimeType={imageMimeType}
            />
          ))}
        </div>
      </div>
    </div>
);};
  