import React from 'react';

const trendingLooks = [
  { name: 'Streetwear Chic', image: 'https://images.unsplash.com/photo-1579228308429-5a8a1a3b2a76?auto=format&fit=crop&w=200&q=80' },
  { name: 'Minimalist Monochrome', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&q=80' },
  { name: 'Bohemian Dream', image: 'https://images.unsplash.com/photo-1517293163179-0d2b7816c277?auto=format&fit=crop&w=200&q=80' },
  { name: 'Vintage Revival', image: 'https://images.unsplash.com/photo-1551963831-29f984533939?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sporty Luxe', image: 'https://images.unsplash.com/photo-1549492423-40021388d3d4?auto=format&fit=crop&w=200&q=80' },
];

// fallback image agar Unsplash block ho jaye
const fallbackImg = "https://via.placeholder.com/200x200.png?text=No+Image";

export const TrendingStyles = () => (
  <div className="w-full mt-8">
    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
      Trending Styles Today
    </h3>

    <div className="flex gap-4 overflow-x-auto pb-4 -mx-8 px-8 no-scrollbar">
      {trendingLooks.map((look, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-40 text-center group cursor-pointer"
        >
          <div className="w-full h-40 overflow-hidden rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-105 bg-gray-200 dark:bg-gray-700">
            <img
              src={look.image}
              alt={look.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => (e.currentTarget.src = fallbackImg)} // fallback image
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-pink-500">
            {look.name}
          </p>
        </div>
      ))}
    </div>
  </div>
);
