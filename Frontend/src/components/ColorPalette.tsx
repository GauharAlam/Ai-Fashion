import React from 'react';
import type { ColorPalette as ColorPaletteType } from '../types';
import { PaletteIcon } from './icons/PaletteIcon';

const colorNameToHex: { [key: string]: string } = {
  // Reds
  'red': '#FF0000', 'crimson': '#DC143C', 'maroon': '#800000', 'tomato': '#FF6347', 'coral': '#FF7F50', 'burgundy': '#800020', 'rust': '#B7410E',
  // Oranges
  'orange': '#FFA500', 'dark orange': '#FF8C00', 'orange red': '#FF4500', 'peach': '#FFDAB9', 'apricot': '#FBCEB1',
  // Yellows
  'yellow': '#FFFF00', 'gold': '#FFD700', 'mustard': '#FFDB58', 'lemon': '#FFFACD', 'cream': '#FFFDD0',
  // Greens
  'green': '#008000', 'lime': '#00FF00', 'forest green': '#228B22', 'olive': '#808000', 'teal': '#008080', 'mint': '#98FF98', 'emerald green': '#50C878', 'olive green': '#6B8E23',
  // Blues
  'blue': '#0000FF', 'navy': '#000080', 'royal blue': '#4169E1', 'sky blue': '#87CEEB', 'turquoise': '#40E0D0', 'cobalt': '#0047AB', 'navy blue': '#000080', 'denim blue': '#1560BD',
  // Purples
  'purple': '#800080', 'violet': '#EE82EE', 'lavender': '#E6E6FA', 'magenta': '#FF00FF', 'indigo': '#4B0082', 'plum': '#DDA0DD',
  // Pinks
  'pink': '#FFC0CB', 'hot pink': '#FF69B4', 'rose': '#FF007F', 'fuchsia': '#FF00FF',
  // Browns
  'brown': '#A52A2A', 'chocolate': '#D2691E', 'tan': '#D2B48C', 'beige': '#F5F5DC', 'khaki': '#C3B091', 'taupe': '#483C32',
  // Whites
  'white': '#FFFFFF', 'ivory': '#FFFFF0', 'off-white': '#F8F8FF', 'snow': '#FFFAFA',
  // Grays
  'gray': '#808080', 'silver': '#C0C0C0', 'charcoal': '#36454F', 'slate': '#708090',
  // Blacks
  'black': '#000000',
};


const ColorChip: React.FC<{ colorName: string }> = ({ colorName }) => {
  const hex = colorNameToHex[colorName.toLowerCase()] || '#CCCCCC';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 rounded-full shadow-md border-2 border-gray-300 dark:border-gray-600" style={{ backgroundColor: hex }}></div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{colorName}</span>
    </div>
  );
};

interface ColorPaletteProps {
  palette: ColorPaletteType;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ palette }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-500 dark:text-pink-400">
            <PaletteIcon/>
            Your Color Palette
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">{palette.justification}</p>

        <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Primary Colors</h3>
            <div className="flex flex-wrap gap-4 mb-6">
                {palette.primary.map((color, index) => <ColorChip key={index} colorName={color} />)}
            </div>

            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Secondary Colors</h3>
            <div className="flex flex-wrap gap-4">
                {palette.secondary.map((color, index) => <ColorChip key={index} colorName={color} />)}
            </div>
        </div>
    </div>
  );
};