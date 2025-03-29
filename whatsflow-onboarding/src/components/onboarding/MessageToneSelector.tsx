import React from 'react';
import { useOnboardingStore, MessageTone } from '@/store/onboardingStore';

type ToneOption = {
  id: MessageTone;
  title: string;
  description: string;
  example: string;
};

const toneOptions: ToneOption[] = [
  {
    id: 'professional',
    title: 'Professional',
    description: 'Clear, concise, and business-appropriate communication',
    example: 'Thank you for your inquiry. Our business hours are Monday to Friday, 9 AM to 5 PM.',
  },
  {
    id: 'friendly',
    title: 'Friendly',
    description: 'Warm and approachable, but still professional',
    example: 'Hi there! Thanks for reaching out. We\'re open Monday to Friday from 9 AM to 5 PM.',
  },
  {
    id: 'casual',
    title: 'Casual',
    description: 'Relaxed and conversational',
    example: 'Hey! Thanks for your message. We\'re around Monday-Friday, 9-5. How can we help?',
  },
  {
    id: 'formal',
    title: 'Formal',
    description: 'Polite, respectful, and traditional',
    example: 'Dear valued customer, we appreciate your inquiry. Our operating hours are Monday through Friday, 9:00 AM to 5:00 PM.',
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Define your own messaging tone',
    example: 'Specify exactly how you want your messages to sound.',
  },
];

const MessageToneSelector: React.FC = () => {
  const { messageTone, setMessageTone, customMessageTone, setCustomMessageTone } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Choose your message tone</h2>
      <p className="text-gray-600">
        This will define how your WhatsApp bot communicates with your customers.
      </p>

      <div className="space-y-3">
        {toneOptions.map((tone) => (
          <div
            key={tone.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-gray-300 ${
              messageTone === tone.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`}
            onClick={() => setMessageTone(tone.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{tone.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{tone.description}</p>
                <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-sm text-gray-700">
                  <p className="italic">"{tone.example}"</p>
                </div>
              </div>
              <div className="ml-4">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  messageTone === tone.id ? 'bg-primary-500 text-white' : 'border border-gray-300'
                }`}>
                  {messageTone === tone.id && (
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

      {/* Custom tone input */}
      {messageTone === 'custom' && (
        <div className="mt-4">
          <label htmlFor="customTone" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your preferred message tone:
          </label>
          <textarea
            id="customTone"
            value={customMessageTone}
            onChange={(e) => setCustomMessageTone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="For example: Enthusiastic and playful with emoji usage"
            rows={4}
          />
        </div>
      )}
    </div>
  );
};

export default MessageToneSelector; 