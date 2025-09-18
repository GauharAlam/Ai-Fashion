import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from './icons/PlusIcon';
import { CrossIcon } from './icons/CrossIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { HeartIcon } from './icons/HeartIcon';

interface FloatingActionMenuProps {
  onFeedbackClick: () => void;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ onFeedbackClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleFeedback = () => {
    onFeedbackClick();
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-40">
      <div className="relative flex flex-col items-center gap-3">
        {isOpen && (
          <div className="flex flex-col items-center gap-3 animate-fade-in-scale">
            <button
              onClick={() => handleNavigation('/my-styles')}
              className="bg-white dark:bg-gray-700 text-pink-500 p-3 rounded-full shadow-lg hover:scale-110 transform transition-transform duration-300"
              aria-label="My Styles"
              title="My Styles"
            >
              <HeartIcon isFilled={false} />
            </button>
            <button
              onClick={handleFeedback}
              className="bg-white dark:bg-gray-700 text-violet-500 p-3 rounded-full shadow-lg hover:scale-110 transform transition-transform duration-300"
              aria-label="Provide Feedback"
              title="Provide Feedback"
            >
              <SparklesIcon />
            </button>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-pink-500 to-violet-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transform transition-all duration-300"
          aria-label="Open action menu"
          aria-expanded={isOpen}
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <PlusIcon />
          </div>
        </button>
      </div>
    </div>
  );
};