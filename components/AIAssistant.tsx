"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Lightbulb, Palette, Type, Layout } from "lucide-react";
import { Slide } from "@/app/page";

interface AIAssistantProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideUpdate: (slideId: string, updates: Partial<Slide>) => void;
  onAddSlide: () => void;
  setSlides: any;
  setCurrentProposal: any;
  currentProposal: any;
  setCurrentStep: any;
  setProposals: any;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIAssistant({
  slides,
  currentSlideIndex,
  onSlideUpdate,
  onAddSlide,
  setSlides,
  setProposals,
  setCurrentProposal,
  currentProposal,
  setCurrentStep,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI presentation assistant. I can help you improve your slides, suggest content, change layouts, and more. What would you like to work on?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    {
      icon: Lightbulb,
      label: "Improve Content",
      prompt: "Can you help improve the content of the current slide?",
    },
    {
      icon: Palette,
      label: "Change Style",
      prompt: "Suggest a different style or color scheme for this slide",
    },
    {
      icon: Layout,
      label: "Better Layout",
      prompt: "Can you suggest a better layout for this slide?",
    },
    {
      icon: Type,
      label: "Rewrite Text",
      prompt: "Help me rewrite the text to be more engaging",
    },
  ];

  // const handleSendMessage = async (text: string) => {
  //   if (!text.trim()) return;

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     text,
  //     sender: 'user',
  //     timestamp: new Date()
  //   };

  //   setMessages(prev => [...prev, userMessage]);
  //   setInputText('');
  //   setIsTyping(true);

  //   // Simulate AI response
  //   setTimeout(() => {
  //     const currentSlide = slides[currentSlideIndex];
  //     let aiResponse = '';

  //     // Simple AI simulation based on keywords
  //     const lowerText = text.toLowerCase();

  //     if (lowerText.includes('improve') || lowerText.includes('better')) {
  //       aiResponse = `I can help improve slide "${currentSlide?.title}". Here are some suggestions:\n\n• Make the title more engaging\n• Add more specific details to the content\n• Use bullet points for better readability\n• Consider adding visual elements\n\nWould you like me to apply any of these changes?`;
  //     } else if (lowerText.includes('style') || lowerText.includes('color')) {
  //       aiResponse = 'I suggest using a more vibrant color scheme with better contrast. We could try a blue and orange theme, or a green and gray professional look. Would you like me to apply one of these styles?';
  //     } else if (lowerText.includes('layout')) {
  //       aiResponse = `For the current slide, I recommend switching to a ${currentSlide?.template === 'bullets' ? 'content' : 'bullets'} layout for better visual impact. This would make the information more digestible. Shall I make this change?`;
  //     } else if (lowerText.includes('rewrite') || lowerText.includes('text')) {
  //       aiResponse = 'I can help rewrite the content to be more engaging and professional. Here\'s a suggestion:\n\n"' + (currentSlide?.content.substring(0, 50) + '... [improved version]"') + '\n\nWould you like me to apply this improvement?';
  //     } else if (lowerText.includes('add slide')) {
  //       onAddSlide();
  //       aiResponse = 'I\'ve added a new slide for you! You can now customize it with your content. What topic would you like to focus on for this new slide?';
  //     } else {
  //       aiResponse = `I understand you want to work on "${text}". I can help you with:\n\n• Content improvements\n• Layout changes\n• Style adjustments\n• Adding new slides\n• Text refinements\n\nWhat specific aspect would you like to focus on first?`;
  //     }

  //     const aiMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       text: aiResponse,
  //       sender: 'ai',
  //       timestamp: new Date()
  //     };

  //     setMessages(prev => [...prev, aiMessage]);
  //     setIsTyping(false);
  //   }, 1500);
  // };
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const currentSlide = slides[currentSlideIndex];
      const lowerText = text.toLowerCase();

      let suggestionText = "";
      let updates: Partial<Slide> | undefined = undefined;

      if (!currentSlide) {
        suggestionText = "Slide not found.";
      } else if (
        lowerText.includes("improve") ||
        lowerText.includes("better")
      ) {
        suggestionText = `I've improved slide "${currentSlide.title}".`;

        updates = {
          content: currentSlide.content + " [Improved]",
          bulletPoints: currentSlide.bulletPoints?.length
            ? [...currentSlide.bulletPoints, "Add a new supporting point"]
            : ["Point 1", "Point 2"],
          template: "bullets",
        };
      } else if (lowerText.includes("style")) {
        suggestionText =
          "Noted your request to change the style. UI styles can be applied during export or design customization.";
      } else if (lowerText.includes("layout")) {
        const newTemplate =
          currentSlide.template === "bullets" ? "content" : "bullets";
        suggestionText = `Layout updated to "${newTemplate}".`;

        updates = {
          template: newTemplate,
        };
      } else if (lowerText.includes("rewrite") || lowerText.includes("text")) {
        suggestionText = "Content rewritten to sound more engaging.";
        updates = {
          content: "Here is an improved version of your content. [Rewritten]",
        };
      } else {
        suggestionText = `I understand you want to work on "${text}". Please let me know whether it's layout, style, or content you'd like to change.`;
      }

      // ✅ Only update current slide if updates exist
      if (updates) {
        const updatedSlides = slides.map((slide, index) =>
          index === currentSlideIndex ? { ...slide, ...updates } : slide
        );
        console.log("updatedSlides :>> ", updatedSlides);
        setSlides(updatedSlides);

        // Optionally, update proposal object if required by your app structure
        const updatedProposal = {
          ...currentProposal,
          slides: updatedSlides,
        };

        setCurrentProposal(updatedProposal);
        setProposals((prev: any) => {
          const [_, ...rest] = prev; // Avoid pushing a new one
          return [updatedProposal, ...rest];
        });

        setCurrentStep("editing");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: suggestionText,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-500">
              Ready to help improve your presentation
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs"
              >
                <Icon className="h-4 w-4 text-gray-600 mb-1" />
                <span className="text-gray-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-98 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-blue-200" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            placeholder="Ask me to improve your slides..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
