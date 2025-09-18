import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CrossIcon } from './icons/CrossIcon';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFeedback('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 flex items-center gap-2">
            <SparklesIcon />
            Share Your Feedback
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <CrossIcon />
          </button>
        </div>
        
        {submitted ? (
            <div className="text-center py-8">
                <p className="text-xl font-semibold text-green-600 dark:text-green-400">Thank you for your feedback!</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We'd love to hear what you think about your experience.
                </p>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us how we can improve..."
                    required
                    className="w-full h-32 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    rows={4}
                />
                <button
                    type="submit"
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
                >
                    Submit Feedback
                </button>
            </form>
        )}
      </div>
    </div>
  );
};
