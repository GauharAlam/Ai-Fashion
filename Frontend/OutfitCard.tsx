import React from 'react';
import type { Outfit } from './types';

interface OutfitCardProps {
  outfit: Outfit;
}

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

const ColorSwatch: React.FC<{ colorName: string }> = ({ colorName }) => {
    const hex = colorNameToHex[colorName.toLowerCase()] || '#CCCCCC';
    return (
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-gray-600" style={{ backgroundColor: hex }} title={colorName}></div>
            <span className="text-sm text-gray-300 capitalize">{colorName}</span>
        </div>
    );
};

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg transition-all duration-300 w-80 md:w-96 flex-shrink-0">
      {/* FIX: Changed property from 'title' to 'styleTitle' to match the Outfit type. */}
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 mb-3">{outfit.styleTitle}</h3>
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {/* FIX: Changed property from 'colors' to 'colorPalette' and adapted map to use colorInfo.name. */}
        {outfit.colorPalette.map((color, index) => <ColorSwatch key={index} colorName={color.name} />)}
      </div>

      {/* FIX: Changed property from 'description' to 'outfitDescription' to match the Outfit type. */}
      <p className="text-gray-300 mb-4">{outfit.outfitDescription}</p>
      
      {/* FIX: Removed sections for 'style', 'fabric', and 'variations' as they do not exist on the Outfit type. */}
      
    </div>
  );
};
