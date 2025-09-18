import React, { useState, useEffect } from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';

const tips = [
  "Balance your proportions. If you're wearing a loose top, pair it with tighter pants, and vice-versa.",
  "When in doubt, wear classic items. A well-fitting blazer, a simple white tee, and dark wash jeans are always in style.",
  "Invest in good shoes. They can make or break an entire outfit.",
  "Understand color theory. Complementary colors create a bold look, while analogous colors are more serene.",
  "Pay attention to fabric. Natural fibers like cotton, wool, and silk often look more luxurious than synthetics.",
  "Accessorize wisely. A statement necklace or a classic watch can elevate a simple look."
];

export const FashionTipsWidget: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 7000); // Change tip every 7 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 p-4 rounded-2xl text-center">
      <h3 className="font-bold text-violet-800 dark:text-violet-300 mb-2 flex items-center justify-center gap-2">
        <LightbulbIcon />
        Fashion Tip of the Day
      </h3>
      <p className="text-sm text-violet-700 dark:text-violet-400 transition-opacity duration-500">
        {tips[currentTipIndex]}
      </p>
    </div>
  );
};