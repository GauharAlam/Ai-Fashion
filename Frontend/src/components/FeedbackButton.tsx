import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface FeedbackButtonProps {
  onClick: () => void;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-white/30 dark:bg-black/20 backdrop-blur-lg text-gray-800 dark:text-gray-200 p-4 rounded-full shadow-lg hover:scale-110 transform transition-transform duration-300 z-40 flex items-center gap-2 group"
      aria-label="Provide Feedback"
    >
      <SparklesIcon />
      <span className="hidden group-hover:inline transition-all">Feedback</span>
    </button>
  );
};