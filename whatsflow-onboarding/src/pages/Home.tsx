import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

const Home: React.FC = () => {
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
        </div>
      </header>
      
      {/* Hero section */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Build WhatsApp Automation in Minutes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Create powerful WhatsApp flows for your business without coding. Automate customer interactions, generate leads, and provide 24/7 support.
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
            <Link to="/onboarding/form">
              <Button size="lg">
                Start with Forms
              </Button>
            </Link>
            <Link to="/onboarding/chat">
              <Button variant="outline" size="lg">
                Start with Chat
              </Button>
            </Link>
          </div>
          
          <div className="mt-24">
            <img 
              src="https://placehold.co/1200x600/e6f7ff/0099ff?text=WhatsFlow+Demo+Screenshot" 
              alt="WhatsFlow Demo" 
              className="max-w-full h-auto rounded-lg shadow-lg" 
            />
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

export default Home; 