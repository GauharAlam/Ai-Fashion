import React, { useState } from 'react';
import type { UserProfile as UserProfileType } from '../types';
import { UserIcon } from './icons/UserIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const bodyShapes = ["", "Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];
const skinTones = ["Fair", "Light", "Medium", "Tan", "Dark"];
const stylePrefs = ["Casual", "Classic", "Trendy", "Bohemian", "Minimalist", "Streetwear", "Chic", "Sporty", "Vintage"];
const genders: UserProfileType['gender'][] = ['Male', 'Female'];

interface UserProfileProps {
  profile: UserProfileType;
  onProfileChange: (newProfile: UserProfileType) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile, onProfileChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleGenderChange = (gender: UserProfileType['gender']) => {
    onProfileChange({ ...profile, gender });
  };

  const handleBodyShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProfileChange({ ...profile, bodyShape: e.target.value });
  };

  const handleSkinToneChange = (tone: string) => {
    onProfileChange({ ...profile, skinTone: tone === profile.skinTone ? "" : tone });
  };

  const handleStylePrefChange = (style: string) => {
    const currentPrefs = profile.stylePreferences || [];
    const newPrefs = currentPrefs.includes(style)
      ? currentPrefs.filter(s => s !== style)
      : [...currentPrefs, style];
    onProfileChange({ ...profile, stylePreferences: newPrefs });
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-2xl shadow-lg transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 dark:text-gray-200"
        aria-expanded={isOpen}
        aria-controls="profile-details"
      >
        <span className="flex items-center gap-2">
          <UserIcon />
          Refine Your Style Profile
        </span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div id="profile-details" className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px]' : 'max-h-0'}`}>
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Provide these details for more personalized recommendations.</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
            <div className="flex flex-wrap gap-2">
              {genders.map(gender => (
                <button
                  key={gender}
                  onClick={() => handleGenderChange(gender)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    profile.gender === gender
                      ? 'bg-pink-600 text-white ring-2 ring-offset-2 ring-pink-500 ring-offset-gray-100 dark:ring-offset-gray-800'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                  aria-pressed={profile.gender === gender}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="body-shape" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body Shape</label>
            <select
              id="body-shape"
              value={profile.bodyShape || ""}
              onChange={handleBodyShapeChange}
              className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            >
              {bodyShapes.map(shape => <option key={shape} value={shape}>{shape || "Select..."}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skin Tone</label>
            <div className="flex flex-wrap gap-2">
              {skinTones.map(tone => (
                <button
                  key={tone}
                  onClick={() => handleSkinToneChange(tone)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    profile.skinTone === tone
                      ? 'bg-pink-600 text-white ring-2 ring-offset-2 ring-pink-500 ring-offset-gray-100 dark:ring-offset-gray-800'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                  aria-pressed={profile.skinTone === tone}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style Preferences</label>
            <div className="flex flex-wrap gap-2">
              {stylePrefs.map(style => (
                <button
                  key={style}
                  onClick={() => handleStylePrefChange(style)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    (profile.stylePreferences || []).includes(style)
                      ? 'bg-violet-600 text-white ring-2 ring-offset-2 ring-violet-500 ring-offset-gray-100 dark:ring-offset-gray-800'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                  aria-pressed={(profile.stylePreferences || []).includes(style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="preferred-colors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Colors</label>
            <input
              id="preferred-colors"
              type="text"
              placeholder="e.g., navy blue, pastel pink, olive"
              value={profile.preferredColors || ""}
              onChange={(e) => onProfileChange({ ...profile, preferredColors: e.target.value })}
              className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate colors with commas.</p>
          </div>

          <div>
            <label htmlFor="disliked-colors" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disliked Colors</label>
            <input
              id="disliked-colors"
              type="text"
              placeholder="e.g., neon green, bright orange"
              value={profile.dislikedColors || ""}
              onChange={(e) => onProfileChange({ ...profile, dislikedColors: e.target.value })}
              className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate colors with commas.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
