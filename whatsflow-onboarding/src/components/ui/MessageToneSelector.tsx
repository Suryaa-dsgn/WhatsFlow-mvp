import React from 'react';
import Card from './Card';

interface MessageToneSelectorProps {
  onSelectTone: (tone: string) => void;
  selectedTone: string | null;
}

const MessageToneSelector: React.FC<MessageToneSelectorProps> = ({ 
  onSelectTone,
  selectedTone 
}) => {
  const tones = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Formal and business-like communication',
      emoji: '👔'
    },
    {
      id: 'friendly',
      name: 'Friendly',
      description: 'Warm and approachable',
      emoji: '😊'
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Relaxed and conversational',
      emoji: '✌️'
    },
    {
      id: 'formal',
      name: 'Formal',
      description: 'Respectful and traditional',
      emoji: '🤝'
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-2">Select a tone for your messages:</p>
      <div className="grid grid-cols-2 gap-3">
        {tones.map(tone => (
          <Card 
            key={tone.id}
            className={`cursor-pointer transition-all p-3 border ${
              selectedTone === tone.id 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => onSelectTone(tone.id)}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-3">{tone.emoji}</div>
              <div>
                <h4 className="font-medium text-sm">{tone.name}</h4>
                <p className="text-xs text-gray-500">{tone.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MessageToneSelector; 