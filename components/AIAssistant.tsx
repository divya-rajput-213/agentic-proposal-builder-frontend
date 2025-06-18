'use client';

import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Slide, Proposal } from '@/app/page';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideUpdate: (slideId: string, updates: Partial<Slide>) => void;
  onAddSlide: () => void;
  setSlides: (slides: Slide[]) => void;
  setCurrentProposal: (proposal: Proposal | null) => void;
  currentProposal: Proposal | null;
  setCurrentStep: (step: "upload" | "processing" | "editing") => void;
  setProposals: (proposals: Proposal[] | ((prev: Proposal[]) => Proposal[])) => void;
}

export function AIAssistant({
  slides,
  currentSlideIndex,
  onSlideUpdate,
  onAddSlide,
  setSlides,
  setCurrentProposal,
  currentProposal,
  setCurrentStep,
  setProposals,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you improve your presentation. You can ask me to modify slides, add new content, change colors, or regenerate the entire presentation.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

   const handleSendMessage = async (additionalText: string) => {
    if (!additionalText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: additionalText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Send only the user's raw input - let backend handle everything
      const proposalPayload = {
        description: additionalText,
      };

      const proposalResponse = await axios.post(
        `${apiUrl}/proposals/generate`,
        proposalPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = proposalResponse.data;

      if (data.success && data.data) {
        // The backend returns slides in data.data array
        const updatedSlides = data.data.map((slide: any) => ({
          ...slide,
          id: slide.id.toString(), // Ensure ID is string
        }));

        // Update slides
        setSlides(updatedSlides);

        // Update current proposal if it exists
        if (currentProposal) {
          const updatedProposal = {
            ...currentProposal,
            slides: updatedSlides,
            updatedAt: new Date(),
          };
          setCurrentProposal(updatedProposal);
          setProposals((prev) =>
            prev.map((p) => (p.id === updatedProposal.id ? updatedProposal : p))
          );
        }

        // Add AI response message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I've updated your presentation based on your request. The presentation now has ${updatedSlides.length} slides with improved content and styling.`,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setCurrentStep("editing");
      } else {
        throw new Error(data.message || "Failed to update presentation");
      }
    } catch (error: any) {      
      let errorMessage = "I encountered an error while processing your request.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorAiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const quickActions = [
    "Make the presentation more professional",
    "Add more bullet points to current slide",
    "Use a dark blue theme",
    "Make it corporate style with gray colors",
    "Add a conclusion slide",
    "Make it more engaging with bright colors",
    "Use a minimalist white theme"
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Ask me to improve your presentation or change colors
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'ai' && (
                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                {message.sender === 'user' && (
                  <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">Quick Actions:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(action)}
              disabled={isTyping}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to improve your presentation or change colors..."
            disabled={isTyping}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}