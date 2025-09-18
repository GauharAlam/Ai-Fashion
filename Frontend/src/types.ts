import React from 'react';

// FIX: Added AuthUser type to be used in auth-related components and services.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// FIX: Added ColorPalette type for use in the ColorPalette component.
export interface ColorPalette {
  justification: string;
  primary: string[];
  secondary: string[];
}

// FIX: Added DosAndDonts type for use in the DosAndDonts component.
export interface DosAndDonts {
  dos: string[];
  donts: string[];
}

// FIX: Added FashionAdvice type to resolve compilation errors in unused components.
export interface FashionAdvice {
  topOutfits: Outfit[];
  colorPalette: ColorPalette;
  accessories: string[];
  occasionFit: string[];
  dosAndDonts: DosAndDonts;
}

// FIX: Added FashionTips type for use in the FashionTips component.
export interface FashionTips {
  generalStyleAdvice: string[];
  fabricCare: string[];
  fitGuide: string[];
}

export interface ColorInfo {
    name: string;
    hex: string;
}

export interface Outfit {
  styleTitle: string;
  outfitDescription: string;
  colorPalette: ColorInfo[];
  occasionFit: string[];
  accessories: string[];
  imagePrompt: string;
}

export interface UserProfile {
  gender: 'Male' | 'Female' | '';
  bodyShape: string;
  skinTone: string;
  stylePreferences: string[];
  preferredColors?: string;
  dislikedColors?: string;
}
