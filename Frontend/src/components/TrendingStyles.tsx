import React from 'react';

const trendingLooks = [
  { name: 'Streetwear Chic', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&q=80 ' },
  { name: 'Minimalist Monochrome', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=200&q=80' },
  { name: 'Bohemian Dream', image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=200&q=80' },
  { name: 'Vintage Revival', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sporty Luxe', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=200&q=80' },
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
              onError={(e: { currentTarget: { src: string; }; }) => (e.currentTarget.src = fallbackImg)} // fallback image
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
