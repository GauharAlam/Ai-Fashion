import React, { useState, useEffect } from 'react';
// FIX: Import UserProfile to use in component props.
import type { FashionAdvice, Outfit, UserProfile } from './src/./types';
import { OutfitCard } from './OutfitCard';
import { ColorPalette } from './src/./components/ColorPalette';
import { DosAndDonts } from './src/./components/DosAndDonts';
import { TagIcon } from './src/./components/icons/TagIcon';
import { CheckCircleIcon } from './src/components/icons/CheckCircleIcon';
import { PlusIcon } from './src/./components/icons/PlusIcon';
import { ShareIcon } from './src/./components/icons/ShareIcon';
import { Loader } from './src/./components/Loader';
import { getMoreOutfits } from './src/./services/geminiService';

interface RecommendationDisplayProps {
  recommendations: FashionAdvice;
  imageBase64: string;
  imageMimeType: string;
  // FIX: Add userProfile to props.
  userProfile: UserProfile;
}

const Section: React.FC<{ title: string, children: React.ReactNode, icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-400">
        {icon}
        {title}
      </h2>
      {children}
    </div>
);

// FIX: Destructure userProfile from props.
export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ recommendations, imageBase64, imageMimeType, userProfile }) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [fetchMoreError, setFetchMoreError] = useState<string | null>(null);
  
  useEffect(() => {
    setOutfits(recommendations.topOutfits);
  }, [recommendations.topOutfits]);

  const handleSeeMoreStyles = async () => {
    setIsFetchingMore(true);
    setFetchMoreError(null);
    try {
      // FIX: Changed property access from '.title' to '.styleTitle' to match the 'Outfit' type.
      const existingTitles = outfits.map(o => o.styleTitle);
      // FIX: Pass userProfile to getMoreOutfits call to resolve "Expected 4 arguments, but got 3" error.
      const newOutfits = await getMoreOutfits(imageBase64, imageMimeType, existingTitles, userProfile);
      setOutfits(prev => [...prev, ...newOutfits]);
    } catch (e) {
      const error = e instanceof Error ? e.message : "An unknown error occurred.";
      setFetchMoreError(error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Fashion Style Report',
          text: 'Check out the personalized fashion advice I got from this AI Stylist!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing is not supported on your browser. You can copy the link from the address bar!');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Your Style Analysis</h2>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {outfits.map((outfit, index) => (
              <OutfitCard key={index} outfit={outfit} />
            ))}
        </div>
      </div>
      
      <div className="bg-gray-800/50 p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3 justify-center">
        <button onClick={handleSeeMoreStyles} disabled={isFetchingMore} className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
          {isFetchingMore ? <><Loader/><span>Loading...</span></> : <><PlusIcon/><span>See More Styles</span></>}
        </button>
        <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
          <ShareIcon />
          <span>Share Report</span>
        </button>
      </div>

      {fetchMoreError && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-xl mt-4" role="alert">
          {fetchMoreError}
        </div>
      )}
      
      <ColorPalette palette={recommendations.colorPalette} />

      <Section title="Accessorize It" icon={<TagIcon />}>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
            {recommendations.accessories.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </Section>
      
      <Section title="Perfect For" icon={<CheckCircleIcon />}>
         <div className="flex flex-wrap gap-2">
            {recommendations.occasionFit.map((item, index) => (
              <span key={index} className="bg-violet-800 text-violet-200 text-sm font-medium px-3 py-1 rounded-full">{item}</span>
            ))}
        </div>
      </Section>

      <DosAndDonts dosAndDonts={recommendations.dosAndDonts} />
    </div>
  );
};
