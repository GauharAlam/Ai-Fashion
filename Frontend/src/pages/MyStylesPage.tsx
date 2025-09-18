import React from 'react';
import { HeartIcon } from '../components/icons/HeartIcon';

const MyStylesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-100 to-violet-100 dark:from-pink-800/50 dark:to-violet-800/50 rounded-full mb-6">
                <HeartIcon isFilled={true} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                My Saved Styles
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
                This is where your saved outfits will appear. This feature is coming soon!
            </p>
        </div>
      </div>
    </div>
  );
};

export default MyStylesPage;
