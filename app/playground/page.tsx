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
      { id: 'conditional-1', type: 'conditional', position: { x: 250, y: 150 }, data: { text: 'Conditional', condition: 'email_address contains "@"' } },
      { id: 'text-msg-invalid', type: 'text-message', position: { x: 450, y: 200 }, data: { text: 'Text Message', content: 'That doesn\'t look like a valid email address. Please provide a valid email to continue.' } },
      { id: 'multi-choice-topics', type: 'multi-choice', position: { x: 250, y: 250 }, data: { text: 'Multiple Choice', content: 'What topics are you interested in?', options: ['Technology', 'Business', 'Lifestyle', 'All topics'] } },
      { id: 'multi-choice-frequency', type: 'multi-choice', position: { x: 250, y: 350 }, data: { text: 'Multiple Choice', content: 'How often would you like to receive our newsletter?', options: ['Daily', 'Weekly', 'Monthly'] } },
      { id: 'text-msg-success', type: 'text-message', position: { x: 250, y: 450 }, data: { text: 'Text Message', content: 'Great! We\'ve added {subscriber_name} ({email_address}) to our newsletter list.' } },
      { id: 'multi-choice-discount', type: 'multi-choice', position: { x: 250, y: 550 }, data: { text: 'Multiple Choice', content: 'Would you like to receive a special discount on your first purchase?', options: ['Yes, please!', 'No, thanks'] } },
      { id: 'collect-info-2', type: 'collect-info', position: { x: 250, y: 650 }, data: { text: 'Collect Information', field: 'phone_number', content: 'Please provide your phone number to receive SMS updates:' } },
      { id: 'text-msg-discount', type: 'text-message', position: { x: 250, y: 750 }, data: { text: 'Text Message', content: 'Your discount code is WELCOME25. Use it for 25% off your next purchase!' } },
    ],
    edges: [
      { id: 'e1-2', source: 'collect-info-1', target: 'conditional-1' },
      { id: 'e2-3', source: 'conditional-1', target: 'text-msg-invalid', label: 'No' },
      { id: 'e2-4', source: 'conditional-1', target: 'multi-choice-topics', label: 'Yes' },
      { id: 'e3-1', source: 'text-msg-invalid', target: 'collect-info-1' },
      { id: 'e4-5', source: 'multi-choice-topics', target: 'multi-choice-frequency' },
      { id: 'e5-6', source: 'multi-choice-frequency', target: 'text-msg-success' },
      { id: 'e6-7', source: 'text-msg-success', target: 'multi-choice-discount' },
      { id: 'e7-8', source: 'multi-choice-discount', target: 'collect-info-2' },
      { id: 'e8-9', source: 'collect-info-2', target: 'text-msg-discount' },
    ]
  },
  orderTracking: {
    name: 'Order Tracking Flow',
    description: 'A WhatsApp flow to help customers track their orders',
    nodes: [
      { id: 'welcome', type: 'text-message', position: { x: 250, y: 50 }, data: { text: 'Text Message', content: 'Welcome to our order tracking service! I can help you track your recent order.' } },
      { id: 'collect-order-id', type: 'collect-info', position: { x: 250, y: 150 }, data: { text: 'Collect Information', field: 'order_id', content: 'Please provide your order ID (it starts with #):' } },
      { id: 'conditional-valid-id', type: 'conditional', position: { x: 250, y: 250 }, data: { text: 'Conditional', condition: 'order_id starts with "#"' } },
      { id: 'invalid-order-id', type: 'text-message', position: { x: 450, y: 300 }, data: { text: 'Text Message', content: 'That doesn\'t look like a valid order ID. Order IDs typically start with # followed by numbers.' } },
      { id: 'order-status', type: 'text-message', position: { x: 250, y: 350 }, data: { text: 'Text Message', content: 'Your order {order_id} is currently in transit and is expected to be delivered tomorrow.' } },
      { id: 'track-options', type: 'multi-choice', position: { x: 250, y: 450 }, data: { text: 'Multiple Choice', content: 'What would you like to do next?', options: ['Get delivery details', 'Change delivery address', 'Speak to customer service', 'Exit'] } },
    ],
    edges: [
      { id: 'e1-2', source: 'welcome', target: 'collect-order-id' },
      { id: 'e2-3', source: 'collect-order-id', target: 'conditional-valid-id' },
      { id: 'e3-4', source: 'conditional-valid-id', target: 'invalid-order-id', label: 'No' },
      { id: 'e3-5', source: 'conditional-valid-id', target: 'order-status', label: 'Yes' },
      { id: 'e4-2', source: 'invalid-order-id', target: 'collect-order-id' },
      { id: 'e5-6', source: 'order-status', target: 'track-options' },
    ]
  },
  customerSupport: {
    name: 'Customer Support Flow',
    description: 'A WhatsApp flow to handle customer inquiries and route them to appropriate departments',
    nodes: [
      { id: 'welcome', type: 'text-message', position: { x: 250, y: 50 }, data: { text: 'Text Message', content: 'Welcome to our customer support! How can we assist you today?' } },
      { id: 'support-options', type: 'multi-choice', position: { x: 250, y: 150 }, data: { text: 'Multiple Choice', content: 'Please select from the following options:', options: ['Product Support', 'Billing Inquiry', 'Return/Exchange', 'Speak to an Agent'] } },
      { id: 'product-support', type: 'multi-choice', position: { x: 100, y: 250 }, data: { text: 'Multiple Choice', content: 'What product do you need help with?', options: ['Smartphone', 'Laptop', 'Accessories', 'Other'] } },
      { id: 'billing-inquiry', type: 'collect-info', position: { x: 250, y: 250 }, data: { text: 'Collect Information', field: 'order_id', content: 'Please provide your order ID for billing inquiry:' } },
      { id: 'return-exchange', type: 'text-message', position: { x: 400, y: 250 }, data: { text: 'Text Message', content: 'To initiate a return or exchange, we\'ll need some information about your order.' } },
      { id: 'agent-connect', type: 'text-message', position: { x: 550, y: 250 }, data: { text: 'Text Message', content: 'We\'re connecting you with a customer support agent. Please wait a moment.' } },
    ],
    edges: [
      { id: 'e1-2', source: 'welcome', target: 'support-options' },
      { id: 'e2-3', source: 'support-options', target: 'product-support' },
      { id: 'e2-4', source: 'support-options', target: 'billing-inquiry' },
      { id: 'e2-5', source: 'support-options', target: 'return-exchange' },
      { id: 'e2-6', source: 'support-options', target: 'agent-connect' },
    ]
  }
};

// Empty initial flow data
const initialFlowData = {
  nodes: [],
  edges: []
};

// Type for WhatsApp preview messages
type PreviewMessage = {
  text: string;
  isUser: boolean;
  options?: string[];
};

export default function PlaygroundPage() {
  const [flowDescription, setFlowDescription] = useState('');
  const [flowData, setFlowData] = useState(initialFlowData);
  const [flowName, setFlowName] = useState('Your WhatsApp Flow');
  const [flowDescription2, setFlowDescription2] = useState('Chat with the AI assistant to create your flow');
  const [currentMessage, setCurrentMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [currentNode, setCurrentNode] = useState(0);
  const [hasGeneratedFlow, setHasGeneratedFlow] = useState(false);
  const [userVariables, setUserVariables] = useState<Record<string, string>>({
    subscriber_name: '',
    email_address: '',
    phone_number: ''
  });
  
  // Flow editor interactivity states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // AI chat messages
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([
    {text: 'Hello! I\'m your AI assistant. I can help you create WhatsApp flows for your business. What kind of flow would you like to build today?', isUser: false},
  ]);
  
  // WhatsApp preview messages - start with empty
  const [previewMessages, setPreviewMessages] = useState<PreviewMessage[]>([
    {text: 'Welcome to WhatsFlow! Create a flow using the AI assistant to see a preview here.', isUser: false},
  ]);
  
  // Animation states for flow generation
  const [isGeneratingFlow, setIsGeneratingFlow] = useState(false);
  const [generatedNodes, setGeneratedNodes] = useState<string[]>([]);
  
  // Function to add a message to WhatsApp preview
  const addPreviewMessage = (message: PreviewMessage) => {
    setPreviewMessages(prev => [...prev, message]);
  };
  
  // Function to handle user input in WhatsApp preview
  const handlePreviewSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewMessage.trim()) return;
    
    // Add user message to preview
    addPreviewMessage({ text: previewMessage, isUser: true });
    
    // Process user response based on current node
    const currentNodeData = flowData.nodes[currentNode];
    
    if (currentNode === 0) {
      // First node - collecting name
      setUserVariables({...userVariables, subscriber_name: previewMessage});
      
      // Move to next node (email collection)
      setTimeout(() => {
        const nextMessage = flowData.nodes[0].data.content.replace('{subscriber_name}', previewMessage);
        addPreviewMessage({ text: nextMessage, isUser: false });
        setCurrentNode(1);
      }, 1000);
    } 
    else if (currentNodeData.type === 'collect-info') {
      // Handle info collection
      const fieldName = currentNodeData.data.field;
      setUserVariables({...userVariables, [fieldName]: previewMessage});
      
      // Process conditional logic or move to next node
      if (fieldName === 'email_address') {
        if (previewMessage.includes('@')) {
          // Valid email - show topics
          setTimeout(() => {
            addPreviewMessage({ 
              text: flowData.nodes[3].data.content, 
              isUser: false,
              options: flowData.nodes[3].data.options
            });
            setCurrentNode(3);
          }, 1000);
        } else {
          // Invalid email - show error
          setTimeout(() => {
            addPreviewMessage({ text: flowData.nodes[2].data.content, isUser: false });
            // Don't advance the node - keep at email collection
          }, 1000);
        }
      } else if (fieldName === 'phone_number') {
        // Phone number collected - show discount code
        setTimeout(() => {
          addPreviewMessage({ text: flowData.nodes[8].data.content, isUser: false });
          setCurrentNode(8);
        }, 1000);
      }
    }
    else if (currentNodeData.type === 'multi-choice') {
      // Handle multiple choice response
      // Find the index of the selected option
      const options = currentNodeData.data.options;
      const selectedIndex = options.findIndex(
        opt => previewMessage.toLowerCase().includes(opt.toLowerCase())
      );
      
      if (currentNodeData.data.content.includes('topics')) {
        // After topics, ask about frequency
        setTimeout(() => {
          addPreviewMessage({ 
            text: flowData.nodes[4].data.content, 
            isUser: false,
            options: flowData.nodes[4].data.options 
          });
          setCurrentNode(4);
        }, 1000);
      }
      else if (currentNodeData.data.content.includes('frequency')) {
        // After frequency, show success message
        setTimeout(() => {
          const successMsg = flowData.nodes[5].data.content
            .replace('{subscriber_name}', userVariables.subscriber_name)
            .replace('{email_address}', userVariables.email_address);
          
          addPreviewMessage({ text: successMsg, isUser: false });
          setCurrentNode(5);
          
          // Then ask about discount
          setTimeout(() => {
            addPreviewMessage({ 
              text: flowData.nodes[6].data.content, 
              isUser: false,
              options: flowData.nodes[6].data.options 
            });
            setCurrentNode(6);
          }, 2000);
        }, 1000);
      }
      else if (currentNodeData.data.content.includes('discount')) {
        // After discount question, ask for phone number
        setTimeout(() => {
          addPreviewMessage({ text: flowData.nodes[7].data.content, isUser: false });
          setCurrentNode(7);
        }, 1000);
      }
    }
    
    // Clear the input
    setPreviewMessage('');
  };
  
  // Generate flow based on user description
  const generateFlow = (type: string) => {
    let selectedFlow;
    let responseText = '';
    
    if (type.includes('newsletter') || type.includes('email') || type.includes('subscription')) {
      selectedFlow = sampleFlows.newsletter;
      responseText = 'I\'ve created a newsletter subscription flow that collects user email, interests, and offers a discount. You can see it in the flow editor.';
    } 
    else if (type.includes('order') || type.includes('track') || type.includes('delivery')) {
      selectedFlow = sampleFlows.orderTracking;
      responseText = 'I\'ve created an order tracking flow that helps customers check their order status. You can see it in the flow editor.';
    }
    else if (type.includes('support') || type.includes('help') || type.includes('customer service')) {
      selectedFlow = sampleFlows.customerSupport;
      responseText = 'I\'ve created a customer support flow that routes inquiries to the right department. You can see it in the flow editor.';
    }
    else {
      // Default to newsletter if no match
      selectedFlow = sampleFlows.newsletter;
      responseText = 'I\'ve created a flow based on your description. It\'s a newsletter subscription flow that collects user information.';
    }
    
    // Trigger flow generation animation
    setIsGeneratingFlow(true);
    setGeneratedNodes([]);
    
    // Animate nodes being added one by one
    selectedFlow.nodes.forEach((node, index) => {
      setTimeout(() => {
        setGeneratedNodes(prev => [...prev, node.id]);
        
        // When all nodes are added, complete the flow update
        if (index === selectedFlow.nodes.length - 1) {
          setTimeout(() => {
            setFlowData({
              nodes: selectedFlow.nodes,
              edges: selectedFlow.edges
            });
            setFlowName(selectedFlow.name);
            setFlowDescription2(selectedFlow.description);
            setHasGeneratedFlow(true);
            setIsGeneratingFlow(false);
            
            // Reset WhatsApp preview for the new flow
            const firstNodeMessage = selectedFlow.nodes[0].data.content || 'Welcome! Let\'s get started.';
            setPreviewMessages([
              {text: firstNodeMessage, isUser: false}
            ]);
            setCurrentNode(0);
            setUserVariables({
              subscriber_name: '',
              email_address: '',
              phone_number: ''
            });
          }, 500);
        }
      }, index * 300); // Add each node with a delay
    });
    
    // Return the AI response message
    return responseText;
  };
  
  // Handle user chat input
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages([...chatMessages, {text: currentMessage, isUser: true}]);
    
    // Analyze the message to determine appropriate response
    const userMessage = currentMessage.toLowerCase();
    setCurrentMessage('');
    
    setTimeout(() => {
      let aiResponse = '';
      
      // Check for flow creation intent
      if (userMessage.includes('create') || userMessage.includes('build') || userMessage.includes('make') || 
          userMessage.includes('generate') || userMessage.includes('need') || userMessage.includes('want')) {
        
        aiResponse = generateFlow(userMessage);
      }
      // Check for modifications
      else if (userMessage.includes('add') || userMessage.includes('change') || userMessage.includes('modify') || 
               userMessage.includes('update') || userMessage.includes('edit')) {
        
        if (userMessage.includes('phone') || userMessage.includes('number')) {
          aiResponse = 'I\'ve added a step to collect phone numbers. Check the updated flow in the editor.';
        } 
        else if (userMessage.includes('discount') || userMessage.includes('offer') || userMessage.includes('coupon')) {
          aiResponse = 'I\'ve added a discount offer to your flow. Users will be asked if they want a special discount.';
        }
        else if (userMessage.includes('option') || userMessage.includes('choice') || userMessage.includes('select')) {
          aiResponse = 'I\'ve updated the flow with additional options for users to choose from.';
        }
        else {
          aiResponse = 'I\'ve updated the flow based on your request. You can see the changes in the editor.';
        }
      }
      // Check for explanation requests
      else if (userMessage.includes('how') || userMessage.includes('explain') || userMessage.includes('what')) {
        if (userMessage.includes('work')) {
          aiResponse = 'This WhatsApp flow works by guiding users through a series of messages, collecting information, and providing responses based on their input. You can test it in the preview panel on the right.';
        } else {
          aiResponse = 'I can help you create different types of WhatsApp flows like newsletter subscriptions, order tracking, customer support, and more. Just let me know what you need.';
        }
      }
      // Default response
      else {
        aiResponse = 'I can help you create a WhatsApp flow. Would you like to build a newsletter subscription, order tracking, or customer support flow?';
      }
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, {text: aiResponse, isUser: false}]);
    }, 1000);
  };

  // Render option buttons for WhatsApp preview
  const renderOptionButtons = (options?: string[]) => {
    if (!options || options.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option, index) => (
          <button
            key={index}
            className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs"
            onClick={() => {
              setPreviewMessage(option);
              const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
              handlePreviewSend(fakeEvent);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };
  
  // Flow editor interactivity functions
  
  // Handle node drag start
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = flowData.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggingNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  // Handle node dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calculate new position based on mouse position, canvas position, and drag offset
    const x = (e.clientX - canvasRect.left - dragOffset.x) / scale - position.x;
    const y = (e.clientY - canvasRect.top - dragOffset.y) / scale - position.y;
    
    // Update node position
    setFlowData(prevData => {
      const newNodes = prevData.nodes.map(node => {
        if (node.id === draggingNode) {
          return { ...node, position: { x, y } };
        }
        return node;
      });
      
      return { ...prevData, nodes: newNodes };
    });
  };
  
  // Handle node drag end
  const handleMouseUp = () => {
    setDraggingNode(null);
  };
  
  // Zoom in function
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2)); // Max zoom 2x
  };
  
  // Zoom out function
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 0.5x
  };
  
  // Reset zoom and position
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Set up event listeners and cleanup
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggingNode(null);
    };
    
    // Add global event listeners to handle mouse up outside the canvas
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-teal-600">Spur - WhatsApp Flow Builder</h1>
            <p className="ml-4 text-sm text-gray-500 hidden sm:block">Create AI-powered WhatsApp flows with natural language</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">suryakantadesign@gmail.com</span>
            <button className="text-sm text-gray-600 hover:text-gray-900">Sign out</button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex justify-start px-4 sm:px-6">
          <button className="px-6 py-4 text-sm font-medium border-b-2 border-teal-500 text-teal-600">
            Edit Flow: {flowName}
          </button>
          <Link href="/dashboard" className="px-6 py-4 text-sm font-medium text-gray-600 hover:text-teal-600">
            Dashboard
          </Link>
        </nav>
      </div>

      {/* Three Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - AI Chat */}
        <div className="w-1/4 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-lg">AI Assistant</h2>
            <p className="text-sm text-gray-500">Chat with AI to customize your flow</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[90%] rounded-lg p-3 ${
                  msg.isUser 
                    ? 'bg-teal-100 ml-auto' 
                    : 'bg-gray-100'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI to create or modify your flow..."
                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-500 hover:text-teal-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {/* Middle Panel - Flow Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <div>
              <h2 className="font-medium text-lg">Flow Editor</h2>
              <p className="text-sm text-gray-500">{flowDescription2}</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Flow Canvas - with proper scrolling and interactivity */}
          <div 
            className="flex-1 overflow-auto relative" 
            style={{ background: "#f8f9fa" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {isGeneratingFlow && (
              <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-6 w-6 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-800">Generating your flow...</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    {generatedNodes.length > 0 && (
                      <div>
                        <p>Added {generatedNodes.length} of {flowData.nodes.length} nodes</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(generatedNodes.length / flowData.nodes.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {!hasGeneratedFlow && !isGeneratingFlow && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center p-6 max-w-md">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-800">No Flow Created Yet</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Chat with the AI assistant on the left to create your WhatsApp flow. 
                    Try asking it to build a specific type of flow.
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Example requests:</p>
                    <ul className="mt-2 space-y-1 text-teal-600">
                      <li>"Create a newsletter subscription flow"</li>
                      <li>"I need an order tracking system"</li>
                      <li>"Build a customer support flow"</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div 
              ref={canvasRef}
              className="absolute w-full h-full p-4" 
              style={{ 
                minHeight: "1400px", 
                minWidth: "2400px", // Increased width for better horizontal scrolling
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'top left',
                transition: 'transform 0.1s ease',
                display: hasGeneratedFlow || isGeneratingFlow ? 'block' : 'none'
              }}
            >
              {/* Dynamic Flow Rendering */}
              {flowData.nodes.map((node, index) => {
                // Calculate absolute positions based on node position
                const nodeX = node.position.x;
                const nodeY = node.position.y;
                
                // Generate the appropriate node styling based on type
                let headerBgColor = 'bg-gray-100';
                let headerTextColor = 'text-gray-800';
                
                if (node.type === 'collect-info') {
                  headerBgColor = 'bg-blue-100';
                  headerTextColor = 'text-blue-800';
                } else if (node.type === 'conditional') {
                  headerBgColor = 'bg-yellow-100';
                  headerTextColor = 'text-yellow-800';
                } else if (node.type === 'text-message') {
                  headerBgColor = 'bg-green-100';
                  headerTextColor = 'text-green-800';
                } else if (node.type === 'multi-choice') {
                  headerBgColor = 'bg-purple-100';
                  headerTextColor = 'text-purple-800';
                }
                
                // Add animation classes for node appearance
                const nodeAppearClass = generatedNodes.includes(node.id) 
                  ? 'animate-fade-in-scale' 
                  : '';
                
                return (
                  <div 
                    key={node.id}
                    className={`absolute bg-white rounded-md shadow-sm border border-gray-200 cursor-move ${draggingNode === node.id ? 'ring-2 ring-teal-500 z-10' : ''} ${nodeAppearClass}`}
                    style={{ 
                      width: "280px",
                      left: `${nodeX}px`,
                      top: `${nodeY}px`,
                      opacity: isGeneratingFlow && !generatedNodes.includes(node.id) ? 0 : 1,
                      transition: 'opacity 0.3s ease, transform 0.3s ease'
                    }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  >
                    <div className={`px-3 py-2 ${headerBgColor} border-b border-gray-200`}>
                      <span className={`text-sm font-medium ${headerTextColor}`}>{node.data.text}</span>
                    </div>
                    <div className="p-3 text-sm">
                      <div>
                        {node.data.content}
                      </div>
                      {node.data.field && (
                        <div className="mt-1 text-xs text-gray-500">Variable: {node.data.field}</div>
                      )}
                      {node.data.options && (
                        <div className="mt-2 pl-2 text-xs text-gray-600 space-y-1">
                          {node.data.options.map((option, i) => (
                            <div key={i}>{option}</div>
                          ))}
                        </div>
                      )}
                      {node.data.condition && (
                        <div>
                          <div className="mt-1 text-xs text-gray-500">{node.data.condition}</div>
                          <div className="mt-1 text-xs">Default</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Render connections between nodes */}
              {flowData.edges.map(edge => {
                const sourceNode = flowData.nodes.find(n => n.id === edge.source);
                const targetNode = flowData.nodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;
                
                // Calculate connection line coordinates
                const sourceY = sourceNode.position.y + 80; // Approximate bottom of source node
                const sourceX = sourceNode.position.x + 140; // Center of source node
                const targetY = targetNode.position.y; // Top of target node
                const targetX = targetNode.position.x + 140; // Center of target node
                
                // Only show edges for nodes that have been generated
                const sourceGenerated = !isGeneratingFlow || generatedNodes.includes(edge.source);
                const targetGenerated = !isGeneratingFlow || generatedNodes.includes(edge.target);
                const showEdge = sourceGenerated && targetGenerated;
                
                if (!showEdge) return null;
                
                // For standard vertical connections
                if (Math.abs(sourceX - targetX) < 10) {
                  return (
                    <div 
                      key={edge.id}
                      className="absolute bg-gray-300" 
                      style={{ 
                        width: '2px',
                        height: `${targetY - sourceY}px`,
                        left: `${sourceX}px`,
                        top: `${sourceY}px`,
                      }}
                    />
                  );
                }
                
                // For branching connections, we return an SVG
                return (
                  <svg 
                    key={edge.id}
                    className="absolute" 
                    style={{ 
                      left: `${sourceX < targetX ? sourceX : targetX}px`,
                      top: `${sourceY}px`,
                      width: `${Math.abs(targetX - sourceX) + 20}px`,
                      height: `${targetY - sourceY + 20}px`,
                      overflow: 'visible'
                    }}
                  >
                    <path 
                      d={`M${sourceX < targetX ? 0 : Math.abs(targetX - sourceX)},0 V${(targetY - sourceY) / 2} H${sourceX < targetX ? Math.abs(targetX - sourceX) : 0} V${targetY - sourceY}`} 
                      stroke="#CBD5E0" 
                      strokeWidth="2" 
                      fill="none"
                      strokeDasharray={edge.source.includes('invalid') ? "5,5" : ""}
                    />
                    {edge.label && (
                      <text 
                        x={sourceX < targetX ? Math.abs(targetX - sourceX) / 2 : Math.abs(targetX - sourceX) / 2}
                        y={(targetY - sourceY) / 2 - 5}
                        className="text-xs fill-gray-500"
                      >
                        {edge.label}
                      </text>
                    )}
                  </svg>
                );
              })}
              
              {/* Zoom Controls */}
              <div className="absolute top-10 left-6 flex flex-col space-y-2">
                <button 
                  className="w-8 h-8 bg-white rounded-md shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  onClick={zoomIn}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button 
                  className="w-8 h-8 bg-white rounded-md shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  onClick={zoomOut}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  </svg>
                </button>
                <button 
                  className="w-8 h-8 bg-white rounded-md shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  onClick={resetView}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </button>
              </div>
              
              {/* Scale Info */}
              <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                Zoom: {Math.round(scale * 100)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - WhatsApp Preview */}
        <div className="w-1/4 border-l border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-lg">WhatsApp Preview</h2>
            <p className="text-sm text-gray-500">Live preview of your flow</p>
          </div>
          
          <div className="flex-1 flex flex-col bg-[#e5ddd5]">
            <div className="bg-teal-600 p-3 text-white">
              <h3 className="text-base font-medium">WhatsApp Preview</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {previewMessages.map((msg, index) => (
                <div key={index} className={`${msg.isUser ? 'ml-auto bg-[#dcf8c6]' : 'bg-white'} max-w-[85%] rounded-lg p-3 shadow-sm`}>
                  <p className="text-sm">{msg.text}</p>
                  {!msg.isUser && renderOptionButtons(msg.options)}
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
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.4s ease-out forwards;
        }
      `}</style>
      
      {/* Footer */}
      <footer className="py-3 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
        Spur WhatsApp Flow Builder MVP
      </footer>
    </div>
  );
} 