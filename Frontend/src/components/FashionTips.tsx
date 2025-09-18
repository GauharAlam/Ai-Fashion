import React, { useState } from 'react';
import type { FashionTips as FashionTipsType } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface FashionTipsProps {
  tips: FashionTipsType;
}

interface AccordionItemProps {
    title: string;
    content: string[];
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!content || content.length === 0) {
        return null;
    }

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <h3>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between py-4 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 rounded-lg"
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>
                    <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </h3>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="px-2 py-4">
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        {content.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export const FashionTips: React.FC<FashionTipsProps> = ({ tips }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-500 dark:text-pink-400">
        <LightbulbIcon />
        Pro Fashion Tips
      </h2>
      <div className="space-y-2">
        <AccordionItem title="General Style Advice" content={tips.generalStyleAdvice} />
        <AccordionItem title="Fabric Care" content={tips.fabricCare} />
        <AccordionItem title="Fit Guide" content={tips.fitGuide} />
      </div>
    </div>
  );
};
