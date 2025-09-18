import React, { useState, useEffect, useMemo } from 'react';
import type { Outfit, UserProfile } from '../types';
import { OutfitCard } from './OutfitCard';
import { PlusIcon } from './icons/PlusIcon';
import { Loader } from './Loader';
import { getMoreOutfits } from '../services/geminiService';
import { FilterIcon } from './icons/FilterIcon';

interface RecommendationDisplayProps {
  recommendations: Outfit[];
  imageBase64: string;
  imageMimeType: string;
  userProfile: UserProfile;
  savedOutfits: Outfit[];
  onToggleSave: (outfit: Outfit) => void;
}

const Section: React.FC<{ title: string, children: React.ReactNode, icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-500 dark:text-pink-400">
        {icon}
        {title}
      </h2>
      {children}
    </div>
);

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ recommendations, imageBase64, imageMimeType, userProfile, savedOutfits, onToggleSave }) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [fetchMoreError, setFetchMoreError] = useState<string | null>(null);
  const [clothingFilters, setClothingFilters] = useState<string[]>([]);
  const [occasionFilters, setOccasionFilters] = useState<string[]>([]);
  const availableFilters = ["Pants", "Shirt", "T-Shirt", "Dress", "Jacket", "Skirt", "Shorts", "Sweater", "Saree", "Kurta", "Suit"];
  
  useEffect(() => {
    setOutfits(recommendations);
  }, [recommendations]);
  
  const availableOccasions = useMemo(() => [...new Set(outfits.flatMap(o => o.occasionFit))], [outfits]);

  const filteredOutfits = useMemo(() => {
    if (occasionFilters.length === 0) {
      return outfits;
    }
    return outfits.filter(outfit => 
        occasionFilters.some(filter => outfit.occasionFit.includes(filter))
    );
  }, [outfits, occasionFilters]);

  const handleToggleClothingFilter = (filter: string) => {
    setClothingFilters(prev => 
        prev.includes(filter) 
            ? prev.filter(f => f !== filter)
            : [...prev, filter]
    );
  };

  const handleToggleOccasionFilter = (occasion: string) => {
    setOccasionFilters(prev => 
        prev.includes(occasion) 
            ? prev.filter(s => s !== occasion)
            : [...prev, occasion]
    );
  };

  const handleSeeMoreStyles = async () => {
    setIsFetchingMore(true);
    setFetchMoreError(null);
    try {
      const existingTitles = outfits.map(o => o.styleTitle);
      const newOutfits = await getMoreOutfits(imageBase64, imageMimeType, existingTitles, userProfile, clothingFilters);
      setOutfits(prev => [...prev, ...newOutfits]);
    } catch (e) {
      const error = e instanceof Error ? e.message : "An unknown error occurred.";
      setFetchMoreError(error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleClearFilters = () => {
    setOccasionFilters([]);
    setClothingFilters([]);
  };

  const areFiltersActive = occasionFilters.length > 0 || clothingFilters.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 dark:from-pink-400 to-violet-500 dark:to-violet-400">Your Style Analysis</h2>
      </div>

      {availableOccasions.length > 1 && (
        <Section title="Filter by Occasion" icon={<FilterIcon />}>
          <div className="flex justify-between items-start mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 pr-4">
                  Select an occasion to filter the outfits below.
              </p>
              {areFiltersActive && (
                  <button
                      onClick={handleClearFilters}
                      className="text-sm font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                  >
                      Clear Filters
                  </button>
              )}
          </div>
          <div className="flex flex-wrap gap-2">
              {availableOccasions.map(occasion => (
                  <button
                      key={occasion}
                      onClick={() => handleToggleOccasionFilter(occasion)}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800/50 ${
                          occasionFilters.includes(occasion)
                          ? 'bg-violet-600 text-white ring-2 ring-violet-500'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      aria-pressed={occasionFilters.includes(occasion)}
                  >
                      {occasion}
                  </button>
              ))}
          </div>
        </Section>
      )}

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {filteredOutfits.map((outfit, index) => {
              const isSaved = savedOutfits.some(saved => saved.styleTitle === outfit.styleTitle);
              return (
                <OutfitCard 
                  key={`${outfit.styleTitle}-${index}`} 
                  outfit={outfit} 
                  isSaved={isSaved}
                  onToggleSave={onToggleSave}
                  imageBase64={imageBase64}
                  imageMimeType={imageMimeType}
                />
              );
            })}
        </div>
        {filteredOutfits.length === 0 && outfits.length > 0 && (
          <div className="text-center py-10 px-4 bg-gray-100 dark:bg-gray-800/50 rounded-2xl shadow-inner">
            <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">No Outfits Match Your Filters</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Try selecting a different occasion or clearing your selection.</p>
          </div>
        )}
      </div>
      
      <Section title="Find Specific Items" icon={<FilterIcon />}>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Looking for something specific? Select items to get targeted new recommendations.
        </p>
        <div className="flex flex-wrap gap-2">
            {availableFilters.map(filter => (
                <button
                    key={filter}
                    onClick={() => handleToggleClothingFilter(filter)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800/50 ${
                        clothingFilters.includes(filter)
                        ? 'bg-pink-600 text-white ring-2 ring-pink-500'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                    aria-pressed={clothingFilters.includes(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
      </Section>
      
      <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3 justify-center">
        <button onClick={handleSeeMoreStyles} disabled={isFetchingMore} className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
          {isFetchingMore ? <><Loader/><span>Loading...</span></> : <><PlusIcon/><span>See More Styles</span></>}
        </button>
      </div>

      {fetchMoreError && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded-xl mt-4" role="alert">
          {fetchMoreError}
        </div>
      )}
    </div>
  );
};
