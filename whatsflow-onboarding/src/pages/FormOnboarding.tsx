import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '@/store/onboardingStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import MessageToneSelector from '@/components/ui/MessageToneSelector';

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

const BusinessTypeStep: React.FC<StepProps> = ({ onNext }) => {
  const { businessType, setBusinessType } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);

  const businessTypes = [
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      icon: '🛍️',
      description: 'Shops, stores, and online retailers'
    },
    {
      id: 'services',
      name: 'Services',
      icon: '👨‍💼',
      description: 'Consulting, professional services, agencies'
    },
    {
      id: 'restaurant',
      name: 'Food & Beverage',
      icon: '🍔',
      description: 'Restaurants, cafes, catering, food delivery'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: '🏥',
      description: 'Clinics, doctors, wellness services'
    },
    {
      id: 'education',
      name: 'Education',
      icon: '🎓',
      description: 'Schools, training, courses, coaching'
    },
    {
      id: 'other',
      name: 'Other',
      icon: '✨',
      description: 'Any other type of business'
    }
  ];

  const handleNext = () => {
    if (!businessType) {
      setError('Please select a business type');
      return;
    }
    
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">What type of business do you have?</h2>
        <p className="text-gray-600">This helps us create WhatsApp flows tailored to your business needs.</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {businessTypes.map(type => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all p-4 border ${
              businessType === type.id 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => setBusinessType(type.id)}
          >
            <div className="flex items-center">
              <div className="text-3xl mr-4">{type.icon}</div>
              <div>
                <h3 className="font-medium text-gray-800">{type.name}</h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          className="w-full md:w-auto"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const BusinessGoalsStep: React.FC<StepProps> = ({ onNext, onBack }) => {
  const { businessGoals, addBusinessGoal, removeBusinessGoal, clearBusinessGoals } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);

  const goals = [
    {
      id: 'lead_generation',
      name: 'Lead Generation',
      icon: '🎯',
      description: 'Attract and capture potential customers'
    },
    {
      id: 'customer_support',
      name: 'Customer Support',
      icon: '🛟',
      description: 'Help and assist your existing customers'
    },
    {
      id: 'appointment_booking',
      name: 'Appointment Booking',
      icon: '📅',
      description: 'Allow customers to schedule meetings or services'
    },
    {
      id: 'promotional',
      name: 'Promotional Campaigns',
      icon: '📣',
      description: 'Send offers, discounts, and marketing messages'
    },
    {
      id: 'feedback',
      name: 'Collect Feedback',
      icon: '📊',
      description: 'Gather reviews and customer opinions'
    }
  ];

  const toggleGoal = (id: string) => {
    if (businessGoals.includes(id)) {
      removeBusinessGoal(id);
    } else {
      addBusinessGoal(id);
    }
  };

  const handleNext = () => {
    if (businessGoals.length === 0) {
      setError('Please select at least one business goal');
      return;
    }
    
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">What are your business goals?</h2>
        <p className="text-gray-600">Select all the goals you want to achieve with WhatsApp automation.</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goals.map(goal => (
          <Card 
            key={goal.id}
            className={`cursor-pointer transition-all p-4 border ${
              businessGoals.includes(goal.id) 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="flex items-center">
              <div className="text-3xl mr-4">{goal.icon}</div>
              <div>
                <h3 className="font-medium text-gray-800">{goal.name}</h3>
                <p className="text-sm text-gray-500">{goal.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

const MessageToneStep: React.FC<StepProps> = ({ onNext, onBack }) => {
  const { messageTone, setMessageTone } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!messageTone) {
      setError('Please select a message tone');
      return;
    }
    
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">How would you like your messages to sound?</h2>
        <p className="text-gray-600">Choose a tone that best represents your brand personality.</p>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <MessageToneSelector 
        onSelectTone={setMessageTone}
        selectedTone={messageTone}
      />
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

const ReviewStep: React.FC<StepProps> = ({ onNext, onBack }) => {
  const { businessType, businessGoals, messageTone } = useOnboardingStore();
  
  const getBusinessTypeName = () => {
    const types = {
      retail: 'Retail & E-commerce',
      services: 'Services',
      restaurant: 'Food & Beverage',
      healthcare: 'Healthcare',
      education: 'Education',
      other: 'Other'
    };
    return businessType ? types[businessType as keyof typeof types] || businessType : 'Not selected';
  };

  const getGoalName = (goalId: string) => {
    const goals = {
      lead_generation: 'Lead Generation',
      customer_support: 'Customer Support',
      appointment_booking: 'Appointment Booking',
      promotional: 'Promotional Campaigns',
      feedback: 'Collect Feedback'
    };
    return goals[goalId as keyof typeof goals] || goalId;
  };

  const getMessageToneName = () => {
    const tones = {
      professional: 'Professional',
      friendly: 'Friendly',
      casual: 'Casual',
      formal: 'Formal'
    };
    return messageTone ? tones[messageTone as keyof typeof tones] || messageTone : 'Not selected';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Review your details</h2>
        <p className="text-gray-600">Please confirm your WhatsApp automation settings.</p>
      </div>
      
      <Card className="p-5 border border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Business Type</h3>
            <p className="text-lg font-medium text-gray-800">{getBusinessTypeName()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Business Goals</h3>
            <ul className="mt-1 space-y-1">
              {businessGoals.map(goal => (
                <li key={goal} className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-800">{getGoalName(goal)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Message Tone</h3>
            <p className="text-lg font-medium text-gray-800">{getMessageToneName()}</p>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={onNext}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

const FormOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { setStep } = useOnboardingStore();
  
  const steps = [
    {
      title: 'Business Type',
      component: (
        <BusinessTypeStep 
          onNext={() => {
            setCurrentStep(1);
            setStep(1);
          }}
        />
      )
    },
    {
      title: 'Business Goals',
      component: (
        <BusinessGoalsStep 
          onNext={() => {
            setCurrentStep(2);
            setStep(2);
          }}
          onBack={() => {
            setCurrentStep(0);
            setStep(0);
          }}
        />
      )
    },
    {
      title: 'Message Tone',
      component: (
        <MessageToneStep 
          onNext={() => {
            setCurrentStep(3);
            setStep(3);
          }}
          onBack={() => {
            setCurrentStep(1);
            setStep(1);
          }}
        />
      )
    },
    {
      title: 'Review',
      component: (
        <ReviewStep 
          onNext={() => {
            // Complete onboarding and navigate to dashboard
            navigate('/dashboard');
          }}
          onBack={() => {
            setCurrentStep(2);
            setStep(2);
          }}
        />
      )
    }
  ];

  const handleSwitch = () => {
    // Switch to chat-based onboarding
    navigate('/onboarding/chat');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with logo */}
      <header className="bg-white py-4 px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.0096 2C6.4837 2 2 6.485 2 12.0097C2 14.0723 2.5827 16.0649 3.6876 17.7812L2.05757 22.1924L6.57894 20.5904C8.23333 21.5828 10.1046 22.0989 12.0096 22.0989C17.5364 22.0989 22 17.6054 22 12.0097C22 6.485 17.5253 2 12.0096 2ZM8.27514 7.6499H9.92953C10.1231 7.6499 10.2845 7.7792 10.3176 7.9621C10.4569 8.6952 10.728 9.84021 11.3107 10.4223C11.4279 10.5402 11.4389 10.7123 11.3439 10.8508C11.1161 11.1875 10.8883 11.5242 10.683 11.8608C10.6057 11.9787 10.6167 12.1297 10.7008 12.2367C11.1271 12.7528 11.6437 13.2149 12.2264 13.5945C12.8422 14.0025 13.5247 14.3176 14.2514 14.5327C14.3907 14.5756 14.53 14.5327 14.6141 14.4042C14.9038 14.0139 15.1825 13.6342 15.4733 13.2473C15.5573 13.1304 15.7077 13.0875 15.836 13.1304C16.5738 13.4239 17.3446 13.6121 18.1154 13.8058C18.309 13.8593 18.4373 14.0563 18.4373 14.255V16.3726C18.4373 16.5911 18.227 16.7732 18.0087 16.7196C17.2489 16.5589 16.5001 16.3297 15.7846 16.0219C14.0461 15.3209 12.4589 14.2962 11.1492 12.9861C9.88574 11.7295 8.85185 10.1416 8.14623 8.3947C8.09204 8.17627 8.10309 7.84725 8.27514 7.6499Z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-900">WhatsFlow</span>
          </div>
          <div>
            <Button 
              variant="outline" 
              onClick={handleSwitch}
              size="sm"
            >
              Switch to Chat
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <ProgressBar 
              value={currentStep} 
              max={steps.length - 1} 
              showSteps={true}
              showPercentage={false}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {steps[currentStep].component}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} WhatsFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FormOnboarding; 