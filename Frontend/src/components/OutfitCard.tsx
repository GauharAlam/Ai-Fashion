import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import type { Outfit, ColorInfo } from '../types';
import { generateOutfitImage } from '../services/geminiService';
import { Loader } from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ShareIcon } from './icons/ShareIcon';
import { TagIcon } from './icons/TagIcon';

interface OutfitCardProps {
  outfit: Outfit;
  isSaved: boolean;
  onToggleSave: (outfit: Outfit) => void;
  imageBase64: string;
  imageMimeType: string;
}

const ColorSwatch: React.FC<{ colorInfo: ColorInfo }> = ({ colorInfo }) => {
    return (
        <div className="flex items-center gap-2" title={colorInfo.name}>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" style={{ backgroundColor: colorInfo.hex }}></div>
        </div>
    );
};

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, isSaved, onToggleSave, imageBase64, imageMimeType }) => {
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(outfit.generatedImages || null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!outfit.generatedImages);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const createImage = async () => {
      // Only generate images if they don't already exist
      if (outfit.generatedImages) return;

      if (!outfit.imagePrompt) {
        setError("No image prompt provided.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const imageB64Array = await generateOutfitImage(outfit.imagePrompt, imageBase64, imageMimeType);
        if (isMounted) {
          setGeneratedImages(imageB64Array);
          // Pass the newly generated images to the parent for potential saving
          outfit.generatedImages = imageB64Array;
        }
      } catch (e) {
        if (isMounted) {
          setError("Could not generate images.");
        }
        console.error(e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    createImage();

    return () => {
      isMounted = false;
    };
  }, [outfit, imageBase64, imageMimeType]);

  const goToPrevious = () => {
    if (generatedImages) {
        const isFirstImage = currentImageIndex === 0;
        const newIndex = isFirstImage ? generatedImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
    }
  };

  const goToNext = () => {
    if (generatedImages) {
        const isLastImage = currentImageIndex === generatedImages.length - 1;
        const newIndex = isLastImage ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
    carouselRef.current?.focus({ preventScroll: true });
  };

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    if (!generatedImages || generatedImages.length === 0) return;

    const imageB64 = generatedImages[currentImageIndex];
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${imageB64}`;
    const fileName = `${outfit.styleTitle.toLowerCase().replace(/\s+/g, '-')}-image-${currentImageIndex + 1}.jpeg`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Ensure the outfit object has the generated images before saving
    const outfitToSave = { ...outfit, generatedImages };
    onToggleSave(outfitToSave);
  };

  const handleShareOutfit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!navigator.share || !generatedImages || generatedImages.length === 0) {
      alert("Sharing is not supported on your browser or there is no image to share.");
      return;
    }

    try {
      const imageB64 = generatedImages[currentImageIndex];
      const response = await fetch(`data:image/jpeg;base64,${imageB64}`);
      const blob = await response.blob();
      const fileName = `${outfit.styleTitle.toLowerCase().replace(/\s+/g, '-')}-image.jpeg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      await navigator.share({
        title: `AI Stylist: ${outfit.styleTitle}`,
        text: `Check out this outfit recommendation!\n\n${outfit.outfitDescription}`,
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing outfit:', error);
    }
  };


  const ImageContainer: React.FC = () => {
    if (isLoading) {
      return (
        <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700/50 rounded-t-2xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
          <Loader className="text-pink-500 dark:text-pink-400" />
          <p className="mt-2 text-sm text-center">Styling your outfit...</p>
        </div>
      );
    }

    if (error || !generatedImages || generatedImages.length === 0) {
      return (
        <div className="w-full aspect-[3/4] bg-red-100 dark:bg-red-900/50 rounded-t-2xl flex flex-col items-center justify-center text-red-600 dark:text-red-300 p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-70" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="mt-2 font-semibold text-sm">{error || "Images failed to load."}</p>
        </div>
      );
    }
    
    return (
        <div 
            ref={carouselRef}
            className="relative w-full aspect-[3/4] group focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800/50 rounded-t-2xl"
            onKeyDown={handleKeyDown}
            tabIndex={0} 
            role="region"
            aria-roledescription="carousel"
            aria-label={`${outfit.styleTitle} outfit images`}
        >
            {generatedImages.length > 1 && (
                <div aria-live="polite" className="sr-only">
                    {`Showing image ${currentImageIndex + 1} of ${generatedImages.length}`}
                </div>
            )}
            <img 
                src={`data:image/jpeg;base64,${generatedImages[currentImageIndex]}`} 
                alt={`AI-generated image ${currentImageIndex + 1} of ${outfit.styleTitle}`}
                className="w-full h-full object-cover rounded-t-2xl bg-gray-200 dark:bg-gray-700"
            />
            <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button 
                  onClick={handleSaveClick}
                  className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label={isSaved ? "Unsave outfit" : "Save outfit"}
                  aria-pressed={isSaved}
                >
                  <HeartIcon isFilled={isSaved} />
                </button>
                <button 
                  onClick={handleDownload}
                  className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Download image"
                >
                  <DownloadIcon />
                </button>
                <button 
                  onClick={handleShareOutfit}
                  className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Share outfit"
                >
                  <ShareIcon />
                </button>
            </div>
            
            {generatedImages.length > 1 && (
                <>
                    <button 
                        onClick={goToPrevious} 
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={goToNext} 
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
            {generatedImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {generatedImages.map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => handleDotClick(index)} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                            aria-label={`Go to image ${index + 1}`}
                        ></button>
                    ))}
                </div>
            )}
        </div>
    );
  };
  
  return (
    <div className="bg-white/30 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transition-all duration-300 w-80 md:w-96 flex-shrink-0 flex flex-col">
      <ImageContainer />
      <div className="p-6 flex flex-col flex-grow gap-4">
        <div>
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 dark:from-pink-400 to-violet-500 dark:to-violet-400 mb-1">{outfit.styleTitle}</h3>
                <div className="flex gap-1.5">
                    {outfit.colorPalette.map((color, index) => <ColorSwatch key={index} colorInfo={color} />)}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {outfit.occasionFit.map((item, index) => (
                      <span key={index} className="bg-violet-200 text-violet-800 dark:bg-violet-800 dark:text-violet-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{item}</span>
                    ))}
                </div>
                {outfit.styleMatch && (
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        {outfit.styleMatch}% Match
                    </div>
                )}
            </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm">{outfit.outfitDescription}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-md text-pink-500/90 dark:text-pink-400/90 mb-2 flex items-center gap-2">
            <TagIcon/>
            Accessories
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600 dark:text-gray-300 pl-2 text-sm">
            {outfit.accessories.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};