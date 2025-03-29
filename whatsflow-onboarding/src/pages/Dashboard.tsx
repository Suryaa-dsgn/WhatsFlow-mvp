import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '@/store/onboardingStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    businessType, 
    businessGoals, 
    messageTone 
  } = useOnboardingStore();

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

  // Restart the onboarding process
  const handleRestartOnboarding = () => {
    navigate('/onboarding/form');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.0096 2C6.4837 2 2 6.485 2 12.0097C2 14.0723 2.5827 16.0649 3.6876 17.7812L2.05757 22.1924L6.57894 20.5904C8.23333 21.5828 10.1046 22.0989 12.0096 22.0989C17.5364 22.0989 22 17.6054 22 12.0097C22 6.485 17.5253 2 12.0096 2ZM8.27514 7.6499H9.92953C10.1231 7.6499 10.2845 7.7792 10.3176 7.9621C10.4569 8.6952 10.728 9.84021 11.3107 10.4223C11.4279 10.5402 11.4389 10.7123 11.3439 10.8508C11.1161 11.1875 10.8883 11.5242 10.683 11.8608C10.6057 11.9787 10.6167 12.1297 10.7008 12.2367C11.1271 12.7528 11.6437 13.2149 12.2264 13.5945C12.8422 14.0025 13.5247 14.3176 14.2514 14.5327C14.3907 14.5756 14.53 14.5327 14.6141 14.4042C14.9038 14.0139 15.1825 13.6342 15.4733 13.2473C15.5573 13.1304 15.7077 13.0875 15.836 13.1304C16.5738 13.4239 17.3446 13.6121 18.1154 13.8058C18.309 13.8593 18.4373 14.0563 18.4373 14.255V16.3726C18.4373 16.5911 18.227 16.7732 18.0087 16.7196C17.2489 16.5589 16.5001 16.3297 15.7846 16.0219C14.0461 15.3209 12.4589 14.2962 11.1492 12.9861C9.88574 11.7295 8.85185 10.1416 8.14623 8.3947C8.09204 8.17627 8.10309 7.84725 8.27514 7.6499Z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-900">WhatsFlow</span>
          </div>
          <div>
            <Button 
              variant="outline" 
              onClick={handleRestartOnboarding}
              size="sm"
            >
              Restart Onboarding
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to WhatsFlow Dashboard</h1>
            <p className="text-lg text-gray-600">Your WhatsApp automation is set up and ready to go!</p>
          </div>
          
          {/* Summary card */}
          <Card className="mb-8 p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your WhatsApp Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Business Type</h3>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {businessType === 'retail' && '🛍️'}
                    {businessType === 'services' && '👨‍💼'}
                    {businessType === 'restaurant' && '🍔'}
                    {businessType === 'healthcare' && '🏥'}
                    {businessType === 'education' && '🎓'}
                    {businessType === 'other' && '✨'}
                    {!businessType && '❓'}
                  </div>
                  <p className="text-lg font-medium text-gray-800">{getBusinessTypeName()}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Message Tone</h3>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {messageTone === 'professional' && '👔'}
                    {messageTone === 'friendly' && '😊'}
                    {messageTone === 'casual' && '✌️'}
                    {messageTone === 'formal' && '🤝'}
                    {!messageTone && '❓'}
                  </div>
                  <p className="text-lg font-medium text-gray-800">{getMessageToneName()}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Business Goals</h3>
                {businessGoals.length > 0 ? (
                  <ul className="space-y-2">
                    {businessGoals.map(goal => (
                      <li key={goal} className="flex items-center">
                        <span className="mr-2">
                          {goal === 'lead_generation' && '🎯'}
                          {goal === 'customer_support' && '🛟'}
                          {goal === 'appointment_booking' && '📅'}
                          {goal === 'promotional' && '📣'}
                          {goal === 'feedback' && '📊'}
                        </span>
                        <span className="text-gray-800">{getGoalName(goal)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No goals selected</p>
                )}
              </div>
            </div>
          </Card>
          
          {/* Recommended templates */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended WhatsApp Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessGoals.map((goal, index) => (
                <Card key={index} className="p-4 border border-gray-200">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {getGoalName(goal)}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {goal === 'lead_generation' && 'Welcome Sequence'}
                    {goal === 'customer_support' && 'Support Chat'}
                    {goal === 'appointment_booking' && 'Appointment Scheduler'}
                    {goal === 'promotional' && 'Promotional Campaign'}
                    {goal === 'feedback' && 'Feedback Collector'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {goal === 'lead_generation' && 'Engage new leads with a personalized welcome sequence.'}
                    {goal === 'customer_support' && 'Provide quick answers to common customer questions.'}
                    {goal === 'appointment_booking' && 'Let customers book and manage appointments easily.'}
                    {goal === 'promotional' && 'Share product updates and special offers.'}
                    {goal === 'feedback' && 'Collect valuable customer feedback and reviews.'}
                  </p>
                  <div className="border-t border-gray-200 pt-3 flex justify-end">
                    <Button size="sm" variant="outline">Preview</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Get started section */}
          <Card className="p-6 border border-gray-200 bg-primary/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to connect with your customers?</h2>
                <p className="text-gray-600 max-w-xl">Your WhatsApp templates are ready to use. Connect your WhatsApp Business account to start engaging with your customers right away.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button size="lg">Connect WhatsApp</Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} WhatsFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard; 