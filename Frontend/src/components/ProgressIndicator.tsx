import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
}

const steps = ["Upload Photo", "AI Analysis", "Get Style"];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                <p
                  className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                    isCurrent ? 'text-pink-500 dark:text-pink-400' : 'text-gray-500'
                  }`}
                >
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-500 ${
                    isActive && stepNumber < currentStep ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};