import React from 'react';
import { useOnboardingStore, BusinessType } from '@/store/onboardingStore';

type BusinessTypeOption = {
  id: BusinessType;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const businessTypes: BusinessTypeOption[] = [
  {
    id: 'retail',
    title: 'Retail Store',
    description: 'Product sales, inventory management, customer orders',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'services',
    title: 'Service Business',
    description: 'Appointments, consultations, service delivery',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'restaurant',
    title: 'Restaurant',
    description: 'Menu items, reservations, takeout orders',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Patient appointments, follow-ups, care instructions',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Course information, student support, learning resources',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'other',
    title: 'Other Business Type',
    description: 'Specify your own business type',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
];

const BusinessTypeSelector: React.FC = () => {
  const { businessType, setBusinessType, customBusinessType, setCustomBusinessType } = useOnboardingStore();
  
  const handleTypeSelect = (type: BusinessType) => {
    setBusinessType(type);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">What type of business do you have?</h2>
      <p className="text-gray-600">We'll customize your WhatsApp flow based on your business type.</p>
      
      <div className="space-y-3">
        {businessTypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-gray-300 ${
              businessType === type.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
            onClick={() => handleTypeSelect(type.id)}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 mt-0.5 p-2 rounded-full ${
                businessType === type.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {type.icon}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{type.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{type.description}</p>
              </div>
              <div className="ml-auto">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  businessType === type.id ? 'bg-primary-500 text-white' : 'border border-gray-300'
                }`}>
                  {businessType === type.id && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom business type input */}
      {businessType === 'other' && (
        <div className="mt-4">
          <label htmlFor="customBusinessType" className="block text-sm font-medium text-gray-700 mb-1">
            Please specify your business type:
          </label>
          <input
            type="text"
            id="customBusinessType"
            value={customBusinessType}
            onChange={(e) => setCustomBusinessType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter your business type"
          />
        </div>
      )}
    </div>
  );
};

export default BusinessTypeSelector; 