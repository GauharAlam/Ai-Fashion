import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { RecommendationDisplay } from '../components/RecommendationDisplay';
import { Loader } from '../components/Loader';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { analyzeImageForFashion } from '../services/geminiService';
import type { Outfit, UserProfile as UserProfileType } from '../types';
import { UserProfile } from '../components/UserProfile';
import { SavedOutfits } from '../components/SavedOutfits';

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
      const isSaved = prevSaved.some(o => o.styleTitle === outfitToToggle.styleTitle);
      let newSavedOutfits;
      if (isSaved) {
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky top-24 flex flex-col items-center gap-6">
            <ImageUploader onImageUpload={handleImageUpload} currentImage={imageBase64} />
            <UserProfile profile={userProfile} onProfileChange={handleProfileChange} />
            
            {imageBase64 && (
              <button
                  onClick={handleStartAnalysis}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                  {isLoading ? (
                      <>
                          <Loader />
                          <span>Analyzing...</span>
                      </>
                  ) : (
                      <>
                          <SparklesIcon />
                          <span>{recommendations ? 'Re-generate Style' : 'Generate Style Analysis'}</span>
                      </>
                  )}
              </button>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded-xl w-full" role="alert">
                  <p className="font-bold">Analysis Failed</p>
                  <p className="text-sm">{error}</p>
              </div>
            )}
        </div>
        
        <div className="lg:col-span-2">
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
              <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-8 bg-gray-100 dark:bg-gray-800/50 rounded-2xl shadow-lg">
                <SparklesIcon />
                <h2 className="text-2xl font-bold mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Welcome to Your AI Stylist</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Upload a photo of yourself and let our AI provide you with personalized fashion advice.
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