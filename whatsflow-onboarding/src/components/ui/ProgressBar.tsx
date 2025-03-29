import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  showPercentage?: boolean;
  showSteps?: boolean;
  className?: string;
  barClassName?: string;
  estimatedTime?: number;  // Time in minutes
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  showPercentage = false,
  showSteps = false,
  className = '',
  barClassName = '',
  estimatedTime,
}) => {
  const percentage = Math.round((value / max) * 100);
  
  // Generate step indicators
  const renderStepIndicators = () => {
    if (!showSteps) return null;
    
    const steps = [];
    for (let i = 1; i <= max; i++) {
      steps.push(
        <div 
          key={i} 
          className={`absolute h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium
            ${i <= value ? 'bg-primary-500 text-white' : 'bg-white border border-gray-300 text-gray-500'}
          `}
          style={{ left: `calc(${(i - 1) / (max - 1) * 100}% - ${i === 1 ? '0px' : i === max ? '20px' : '10px'})` }}
        >
          {i}
        </div>
      );
    }
    
    return (
      <div className="relative h-5 flex items-center mb-6">
        {steps}
      </div>
    );
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Step indicators if enabled */}
      {renderStepIndicators()}
      
      <div className="flex items-center justify-between mb-2">
        {showSteps && (
          <div className="text-sm font-medium text-gray-700">
            Step {value} of {max}
          </div>
        )}
        
        {showPercentage && (
          <div className="text-sm font-medium text-gray-700">
            {percentage}%
          </div>
        )}
        
        {estimatedTime !== undefined && (
          <div className="text-sm text-gray-500">
            ~{estimatedTime} min remaining
          </div>
        )}
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-primary-500 transition-all duration-300 ease-in-out ${barClassName}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 