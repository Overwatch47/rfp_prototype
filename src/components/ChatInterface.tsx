import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Loader } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  isComplete: boolean;
}

const hardcodedResponses: Record<string, string> = {
  default: "I've analyzed the Mumbai Metro Phase 3 RFP. Our 11kV Copper XLPE cables are an excellent match with 94.5% compatibility. The proposal includes technical specs, pricing breakdown, and delivery timeline. Total quote is ₹14,781,250 for 30,000 meters with comprehensive testing.",
  price: "The total cost breakdown is: Material cost ₹14,000,000 + Testing cost ₹20,000 + Delivery ₹25,000 = ₹14,045,000. Volume discounts of 5-8% are available for larger orders. Payment terms: 50% advance, 50% on delivery.",
  timeline: "Expected delivery timeline is 30 days from order confirmation. We have sufficient stock of the recommended SKUs. Quality testing and certifications will be completed before shipment. Expedited delivery (15 days) is available at 10% premium.",
  specs: "The selected cables meet IS 7098 Part 2 standards, feature flame-retardant properties, and are suitable for underground installation. All products have been tested for voltage withstand, partial discharge, and fire resistance. Documentation and test certificates will be provided.",
  recommendation: "Based on technical requirements, cost efficiency, and delivery capability, I recommend the 11kV Copper XLPE solution. It offers 94.5% spec match, competitive pricing, and proven reliability. Alternative aluminum option available at 8% cost reduction with slightly lower conductivity.",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      content: "Hello! I'm the Orchestrator Agent. I've analyzed the Mumbai Metro Phase 3 RFP and compiled a comprehensive proposal. Feel free to ask me any questions about specifications, pricing, timeline, or recommendations.",
      isComplete: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
      return hardcodedResponses.price;
    }
    if (lowerMessage.includes('timeline') || lowerMessage.includes('delivery') || lowerMessage.includes('when')) {
      return hardcodedResponses.timeline;
    }
    if (lowerMessage.includes('spec') || lowerMessage.includes('technical') || lowerMessage.includes('requirement')) {
      return hardcodedResponses.specs;
    }
    if (lowerMessage.includes('recommend') || lowerMessage.includes('best') || lowerMessage.includes('alternative')) {
      return hardcodedResponses.recommendation;
    }

    return hardcodedResponses.default;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      isComplete: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = getResponse(inputValue);
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      content: response,
      isComplete: false,
    };

    setMessages((prev) => [...prev, agentMessage]);

    let currentText = '';
    const typingSpeed = 15;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < response.length) {
        currentText += response[charIndex];
        charIndex++;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: currentText,
          };
          return updated;
        });
      } else {
        clearInterval(typeInterval);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            isComplete: true,
          };
          return updated;
        });
        setIsLoading(false);
      }
    }, typingSpeed);
  };

  return (
    <div className="flex flex-col h-96 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-950/50">
        <MessageCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-semibold text-white">Orchestrator Agent Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-slate-800 border border-slate-700 text-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.sender === 'agent' && !message.isComplete && (
                <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse"></span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-700/50 bg-slate-950/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about pricing, specs, timeline..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-lg transition-all duration-300 flex items-center gap-1"
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
