import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { RecommendationDisplay } from '../components/RecommendationDisplay';
import { Loader } from '../components/Loader';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { analyzeImageForFashion } from '../services/geminiService';
// FIX: Removed unused 'FashionAdvice' type to resolve type mismatches with geminiService.
import type { Outfit, UserProfile as UserProfileType } from '../types';
import { UserProfile } from '../components/UserProfile';
import { SavedOutfits } from '../components/SavedOutfits';

// FIX: Added missing 'gender' property to satisfy the UserProfileType interface.
const initialProfile: UserProfileType = {
  gender: '',
  bodyShape: '',
  skinTone: '',
  stylePreferences: [],
  preferredColors: '',
  dislikedColors: '',
};

function HomePage() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  // FIX: Changed state type from 'FashionAdvice' to 'Outfit[]' to match the return type of 'analyzeImageForFashion'.
  const [recommendations, setRecommendations] = useState<Outfit[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileType>(initialProfile);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      const savedOutfitsData = localStorage.getItem('savedOutfits');
      if (savedOutfitsData) {
        setSavedOutfits(JSON.parse(savedOutfitsData));
      }
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  const handleProfileChange = (newProfile: UserProfileType) => {
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  const handleToggleSaveOutfit = (outfitToToggle: Outfit) => {
    setSavedOutfits(prevSaved => {
      // FIX: Changed property access from '.title' to '.styleTitle' to match the 'Outfit' type.
      const isSaved = prevSaved.some(o => o.styleTitle === outfitToToggle.styleTitle);
      let newSavedOutfits;
      if (isSaved) {
        // FIX: Changed property access from '.title' to '.styleTitle' to match the 'Outfit' type.
        newSavedOutfits = prevSaved.filter(o => o.styleTitle !== outfitToToggle.styleTitle);
      } else {
        newSavedOutfits = [...prevSaved, outfitToToggle];
      }
      localStorage.setItem('savedOutfits', JSON.stringify(newSavedOutfits));
      return newSavedOutfits;
    });
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file.");
        return;
    }
    setIsLoading(false);
    setError(null);
    setRecommendations(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageBase64(base64String);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };
  
  const handleStartAnalysis = async () => {
    if (!imageBase64 || !imageMimeType) {
        setError("Please upload an image first.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
        const base64Data = imageBase64.split(',')[1];
        const result = await analyzeImageForFashion(base64Data, imageMimeType, userProfile);
        setRecommendations(result);
    } catch (e) {
        const err = e instanceof Error ? e.message : "An unknown error occurred while analyzing the image.";
        setError(err);
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="flex flex-col items-center gap-4 sticky top-24">
            <ImageUploader onImageUpload={handleImageUpload} currentImage={imageBase64} />
            <UserProfile profile={userProfile} onProfileChange={handleProfileChange} />
            
            {imageBase64 && !isLoading && !recommendations && (
              <button
                  onClick={handleStartAnalysis}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
              >
                  <SparklesIcon />
                  <span>Generate Style Analysis</span>
              </button>
            )}
            
            {isLoading && (
                <div className="flex items-center justify-center gap-2 bg-pink-600 text-white font-bold py-2 px-4 rounded-lg w-full">
                  <Loader />
                  <span>Analyzing your style...</span>
                </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded-xl w-full" role="alert">
                  {error}
              </div>
            )}

            {!isLoading && !error && !recommendations && (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl w-full">
                {!imageBase64 ? (
                  <p>Upload a photo to get personalized fashion advice!</p>
                ) : (
                  <p>Refine your profile, then click "Generate" to see the magic!</p>
                )}
              </div>
            )}
        </div>
        
        <div className="md:col-span-1">
          {recommendations && imageBase64 ? (
            <RecommendationDisplay 
              recommendations={recommendations} 
              imageBase64={imageBase64.split(',')[1]} 
              imageMimeType={imageMimeType}
              userProfile={userProfile}
              savedOutfits={savedOutfits}
              onToggleSave={handleToggleSaveOutfit}
            />
          ) : (
            !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-100 dark:bg-gray-800/50 rounded-2xl shadow-lg">
                <SparklesIcon />
                <h2 className="text-2xl font-bold mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Welcome to Your AI Stylist</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  This is your personal dashboard. Upload a photo to begin your style analysis.
                </p>
              </div>
            )
          )}
        </div>
      </div>
      
      {savedOutfits.length > 0 && imageBase64 && (
        <SavedOutfits 
          savedOutfits={savedOutfits} 
          onToggleSave={handleToggleSaveOutfit}
          imageBase64={imageBase64.split(',')[1]}
          imageMimeType={imageMimeType}
        />
      )}
    </>
  );
}

export default HomePage;
