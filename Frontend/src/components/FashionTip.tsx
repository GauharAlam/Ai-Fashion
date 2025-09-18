import React from 'react';

const tips = [
  "Balance your proportions. If you're wearing something bulky on top, keep the bottom slim, and vice-versa.",
  "When in doubt, wear classic items. A well-fitting t-shirt, tailored trousers, and a simple blazer never go out of style.",
  "Invest in good quality shoes. They can make or break an outfit.",
  "Don't be afraid of color! Start with one colorful piece and keep the rest of your outfit neutral.",
  "Accessorize! A simple outfit can be elevated with the right jewelry, a stylish bag, or a great belt."
];

export const FashionTip = () => {
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="p-4 rounded-2xl bg-white/30 dark:bg-black/20 backdrop-blur-lg shadow-lg border border-white/20">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        <span className="text-2xl">💡</span> Fashion Tip of the Day
      </h3>
      <p className="text-sm text-gray-800 dark:text-gray-200">{tip}</p>
    </div>
  );
};