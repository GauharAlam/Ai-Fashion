import React from 'react';

const Step = ({ icon, label, isActive, isCompleted }: { icon: string, label: string, isActive: boolean, isCompleted: boolean }) => (
  <div className="flex flex-col items-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${isActive ? 'bg-pink-500 text-white scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
      {icon}
    </div>
    <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-pink-500' : 'text-gray-600 dark:text-gray-400'}`}>{label}</p>
  </div>
);

export const StepProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: '📸', label: 'Upload' },
    { icon: '🤖', label: 'AI Analysis' },
    { icon: '👔', label: 'Get Style' }
  ];

  return (
    <div className="w-full flex justify-between items-center px-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Step
            icon={step.icon}
            label={step.label}
            isActive={currentStep === index}
            isCompleted={currentStep > index}
          />
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-500 ${currentStep > index ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};