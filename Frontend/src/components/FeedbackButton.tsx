import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface FeedbackButtonProps {
  onClick: () => void;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-violet-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transform transition-transform duration-300 z-40 flex items-center gap-2"
      aria-label="Provide Feedback"
    >
      <SparklesIcon />
      <span className="hidden md:inline">Feedback</span>
    </button>
  );
};
