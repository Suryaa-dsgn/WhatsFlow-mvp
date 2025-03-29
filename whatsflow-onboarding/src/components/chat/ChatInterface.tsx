import React, { useState, useRef, useEffect } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import MessageToneSelector from '@/components/ui/MessageToneSelector';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onComplete: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { 
    setBusinessType, 
    setBusinessGoals, 
    setMessageTone, 
    messageTone 
  } = useOnboardingStore();

  const steps = [
    {
      prompt: "Hi there! 👋 I'm your WhatsFlow assistant. I'll help you set up your WhatsApp business flows. What type of business do you run?",
      expectedInput: "businessType",
      next: (value: string) => {
        setBusinessType(value);
        return 1;
      }
    },
    {
      prompt: "Great! And what are your main goals for using WhatsApp for your business?",
      expectedInput: "businessGoals",
      next: (value: string) => {
        setBusinessGoals(value);
        return 2;
      }
    },
    {
      prompt: "Now, let's set up the tone for your WhatsApp messages. You can select from the options below or type your preferred tone.",
      expectedInput: "messageTone",
      showToneSelector: true,
      next: (value: string) => {
        setMessageTone(value);
        return 3;
      }
    },
    {
      prompt: "Thanks for providing all that information! I've created a personalized WhatsApp flow for your business. Would you like to see it?",
      expectedInput: "confirmation",
      next: () => {
        return 4;
      }
    }
  ];

  // Add initial welcome message when component mounts
  useEffect(() => {
    setTimeout(() => {
      addMessage(steps[0].prompt, 'assistant');
    }, 500);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when typing state changes
  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateMessageId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: generateMessageId(),
      content,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const simulateTyping = async (message: string) => {
    setIsTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(message.length * 20, 2000);
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    setIsTyping(false);
    addMessage(message, 'assistant');
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    addMessage(inputValue, 'user');
    
    // Process user input based on current step
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      const nextStep = step.next(inputValue);
      
      setCurrentStep(nextStep);
      setInputValue('');
      
      // If there's a next step, send its prompt
      if (nextStep < steps.length) {
        await simulateTyping(steps[nextStep].prompt);
      } else {
        // Onboarding complete
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }
  };

  const handleToneSelect = async (tone: string) => {
    addMessage(`I prefer a ${tone} tone for my messages.`, 'user');
    setMessageTone(tone);
    
    setCurrentStep(3);
    await simulateTyping(steps[3].prompt);
  };

  const calculateProgress = () => {
    return Math.round((currentStep / steps.length) * 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress indicator */}
      <div className="mb-4">
        <ProgressBar 
          value={calculateProgress()} 
          max={100}
          showSteps={true}
          showPercentage={false}
          estimatedTime={`Step ${currentStep + 1} of ${steps.length}`}
        />
      </div>
      
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto mb-4 p-2">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Tone selector (only shown at appropriate step) */}
      {currentStep === 2 && (
        <div className="mb-4">
          <MessageToneSelector onSelectTone={handleToneSelect} selectedTone={messageTone} />
        </div>
      )}
      
      {/* Input area */}
      <form onSubmit={handleMessageSubmit} className="mt-auto">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-20"
            disabled={isTyping || currentStep >= steps.length}
          />
          <div className="absolute right-2">
            <Button
              type="submit"
              disabled={isTyping || !inputValue.trim() || currentStep >= steps.length}
              size="sm"
              className="rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 