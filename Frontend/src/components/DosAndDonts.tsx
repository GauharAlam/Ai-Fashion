import React from 'react';
import type { DosAndDonts as DosAndDontsType } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { CrossIcon } from './icons/CrossIcon';

interface DosAndDontsProps {
  dosAndDonts: DosAndDontsType;
}

export const DosAndDonts: React.FC<DosAndDontsProps> = ({ dosAndDonts }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-pink-500 dark:text-pink-400">Fashion Do's & Don'ts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
            <span className="bg-green-500/20 p-1 rounded-full"><CheckIcon /></span>
            Do's
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {dosAndDonts.dos.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-green-500 dark:text-green-400 mt-1">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
            <span className="bg-red-500/20 p-1 rounded-full"><CrossIcon /></span>
            Don'ts
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {dosAndDonts.donts.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-red-500 dark:text-red-400 mt-1">&#10007;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};