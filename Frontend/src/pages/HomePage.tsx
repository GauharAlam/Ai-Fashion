import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { RecommendationDisplay } from '../components/RecommendationDisplay';
import { Loader } from '../components/Loader';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { analyzeImageForFashion } from '../services/geminiService';
import type { Outfit, UserProfile as UserProfileType } from '../types';
import { UserProfile } from '../components/UserProfile';
import { SavedOutfits } from '../components/SavedOutfits';
import { StepProgressBar } from '../components/StepProgressBar';
import { FashionTip } from '../components/FashionTip';
import { TrendingStyles } from '../components/TrendingStyles';

const initialProfile: UserProfileType = {
  gender: '',
  bodyShape: '',
  skinTone: '',
  stylePreferences: [],
  preferredColors: '',
  dislikedColors: '',
  budget: 500,
};

function HomePage() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Outfit[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileType>(initialProfile);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

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
    setCurrentStep(0);

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
    setCurrentStep(1);

    try {
        const base64Data = imageBase64.split(',')[1];
        if (base64Data.startsWith('http')) {
          throw new Error("Cannot analyze a placeholder image. Please upload your own photo.");
        }
        const result = await analyzeImageForFashion(base64Data, imageMimeType, userProfile);
        const newRecommendations = result.map(r => ({ ...r, styleMatch: Math.floor(Math.random() * (99 - 70 + 1)) + 70 }));
        setRecommendations(newRecommendations);

        // Save the new session to localStorage
        const sessionToSave = {
            recommendations: newRecommendations,
            imageBase64,
            imageMimeType
        };
        localStorage.setItem('fashionSession', JSON.stringify(sessionToSave));

        setCurrentStep(2);
    } catch (e) {
        const err = e instanceof Error ? e.message : "An unknown error occurred while analyzing the image.";
        setError(err);
        setCurrentStep(0);
    } finally {
        setIsLoading(false);
    }
  };
  
  
  const handleTryRandomModel = () => {
    // Using a higher quality placeholder that looks more like a model photo
    const placeholderImage = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80';
    
    // We can't actually get a base64 string from a URL without more complex logic (like fetching and converting)
    // For a simple demo, we'll just set the URL to be displayed. The analysis button will be disabled for it.
    setImageBase64(placeholderImage);
    setImageMimeType('image/jpeg'); // Set a dummy mime type
  };
  
  return (
    <>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky top-24 flex flex-col items-center gap-6 p-6 rounded-2xl bg-white/30 dark:bg-black/20 backdrop-blur-lg shadow-lg border border-white/20">
            <StepProgressBar currentStep={currentStep} />
            <ImageUploader onImageUpload={handleImageUpload} currentImage={imageBase64} />
            <UserProfile profile={userProfile} onProfileChange={handleProfileChange} />
            <FashionTip />
             <div className="w-full flex gap-2">
                <button
                    onClick={handleTryRandomModel}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-800"
                >
                    Use Model
                </button>
                {imageBase64 && (
                  <button
                      onClick={handleStartAnalysis}
                      disabled={isLoading || (imageBase64 && imageBase64.startsWith('http'))}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800 disabled:opacity-70 disabled:cursor-not-allowed"
                      title={imageBase64 && imageBase64.startsWith('http') ? "Analysis is disabled for model photos." : ""}
                  >
                      {isLoading ? <Loader /> : <SparklesIcon />}
                      <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
                  </button>
                )}
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded-xl w-full" role="alert">
                  <p className="font-bold">Analysis Failed</p>
                  <p className="text-sm">{error}</p>
              </div>
            )}
        </div>
        
        <div className="lg:col-span-2">
          {recommendations && imageBase64 ? (
            <RecommendationDisplay 
              recommendations={recommendations} 
              imageBase64={imageBase64.startsWith('http') ? '' : imageBase64.split(',')[1]} 
              imageMimeType={imageMimeType}
              userProfile={userProfile}
              savedOutfits={savedOutfits}
              onToggleSave={handleToggleSaveOutfit}
            />
          ) : (
            !isLoading && (
              <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-8 bg-white/30 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
                <img src="https://cdn-icons-png.flaticon.com/512/10430/10430932.png" alt="AI Assistant" className="w-32 h-32 rounded-full mb-4 shadow-lg bg-white/50 p-2" />
                <h2 className="text-3xl font-bold mt-4 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Welcome to Your AI Stylist</h2>
                <p className="text-gray-800 dark:text-gray-200 max-w-sm">
                  Upload a photo of yourself or use a model to get personalized fashion advice instantly.
                </p>
                <TrendingStyles />
              </div>
            )
          )}
        </div>
      </div>
      
      {savedOutfits.length > 0 && imageBase64 && (
        <SavedOutfits 
          savedOutfits={savedOutfits} 
          onToggleSave={handleToggleSaveOutfit}
          imageBase64={imageBase64.startsWith('http') ? '' : imageBase64.split(',')[1]}
          imageMimeType={imageMimeType}
        />
      )}
    </>
  );
}

export default HomePage;