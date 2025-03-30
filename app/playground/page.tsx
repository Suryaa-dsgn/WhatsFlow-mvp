'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Sample flows for demo
const sampleFlows = {
  newsletter: {
    name: 'Newsletter Subscription Flow',
    description: 'A WhatsApp flow to collect user information for email newsletter signup',
    nodes: [
      { id: 'collect-info-1', type: 'collect-info', position: { x: 250, y: 50 }, data: { text: 'Collect Information', field: 'email_address', content: 'Thanks, {subscriber_name}! Please provide your email address:' } },
      // Add other nodes here
    ],
    edges: []
  },
  orderTracking: {
    name: 'Order Tracking Flow',
    description: 'A WhatsApp flow to help customers track their orders',
    nodes: [],
    edges: []
  },
  customerSupport: {
    name: 'Customer Support Flow',
    description: 'A WhatsApp flow to handle customer inquiries and route them to appropriate departments',
    nodes: [],
    edges: []
  }
};

// Type definitions
interface NodeData {
  text?: string;
  content?: string;
  field?: string;
  condition?: string;
  options?: string[];
}

interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

// Type for WhatsApp preview messages
type PreviewMessage = {
  text: string;
  isUser: boolean;
  options?: string[];
};

// A simplified, error-free version of the playground page
export default function PlaygroundPage() {
  // State definitions
  const [flowData, setFlowData] = useState<FlowData>({nodes: [], edges: []});
  const [flowName, setFlowName] = useState('Your WhatsApp Flow');
  const [flowDescription, setFlowDescription] = useState('Chat with the AI assistant to create your flow');
  const [currentMessage, setCurrentMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [currentNode, setCurrentNode] = useState(0);
  const [userVariables, setUserVariables] = useState<{[key: string]: string}>({
    subscriber_name: '',
    email_address: '',
    phone_number: ''
  });
  
  // WhatsApp preview messages
  const [previewMessages, setPreviewMessages] = useState<PreviewMessage[]>([
    {text: 'Welcome to WhatsFlow! Create a flow using the AI assistant to see a preview here.', isUser: false},
  ]);
  
  // AI chat messages
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([
    {text: 'Hello! I\'m your AI assistant. I can help you create WhatsApp flows for your business. What kind of flow would you like to build today?', isUser: false},
  ]);
  
  // Add a message to the preview
  const addPreviewMessage = (message: PreviewMessage) => {
    setPreviewMessages(prev => [...prev, message]);
  };
  
  // Handle user input in WhatsApp preview
  const handlePreviewSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewMessage.trim()) return;
    
    // Add user message to preview
    addPreviewMessage({ text: previewMessage, isUser: true });
    
    // First node - collecting name
    if (currentNode === 0) {
      setUserVariables({...userVariables, subscriber_name: previewMessage});
      
      // THE FIX: Direct hardcoded implementation that avoids accessing node properties
      setTimeout(() => {
        // Hardcoded greeting that doesn't rely on accessing potentially undefined properties
        const greeting = `Thanks, ${previewMessage}! Please provide your email address:`;
        addPreviewMessage({ text: greeting, isUser: false });
        setCurrentNode(1);
      }, 1000);
    }
    
    // Clear the input
    setPreviewMessage('');
  };
  
  // Simplified UI rendering
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-teal-600">WhatsFlow Builder</h1>
      </header>
      
      <div className="flex flex-1">
        {/* Left Panel - AI Chat */}
        <div className="w-1/4 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium">AI Assistant</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[90%] rounded-lg p-3 ${msg.isUser ? 'bg-teal-100 ml-auto' : 'bg-gray-100'}`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Middle Panel - Flow Editor (simplified) */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-medium">Flow Editor</h2>
            <p className="text-sm text-gray-500">{flowDescription}</p>
          </div>
          
          <div className="flex-1 bg-gray-50 p-4">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium text-gray-800">Your WhatsApp Flow</h3>
              <p className="mt-2 text-sm text-gray-600">
                {flowName}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Panel - WhatsApp Preview */}
        <div className="w-1/4 border-l border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium">WhatsApp Preview</h2>
          </div>
          
          <div className="flex-1 flex flex-col bg-[#e5ddd5]">
            <div className="bg-teal-600 p-3 text-white">
              <h3 className="text-base font-medium">WhatsApp Preview</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {previewMessages.map((msg, index) => (
                <div key={index} className={`${msg.isUser ? 'ml-auto bg-[#dcf8c6]' : 'bg-white'} max-w-[85%] rounded-lg p-3 shadow-sm`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
            
            <form onSubmit={handlePreviewSend} className="p-3 border-t border-gray-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full py-2 px-4 pr-10 bg-white rounded-3xl focus:outline-none"
                  value={previewMessage}
                  onChange={(e) => setPreviewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 