import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Loader2,
  ShieldAlert,
  Brain,
  Compass,
} from 'lucide-react';
import { AppState } from '../types';

interface AiStewardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiStewardDrawer: React.FC<AiStewardDrawerProps> = ({
  isOpen,
  onClose,
  appState,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Peace be upon your discipline. I am your Steward OS Intelligence. I evaluate only outputs, consistency, and objective reality—without guilt, rationalization, or emotional stories. What is your inquiry or friction point?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/steward-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            currentStreak: appState.currentStreakNeverZero,
            failureLogsCount: appState.failurePatternLogs.length,
            neverZeroPassedToday: appState.dailyCompletions[appState.currentDate]?.neverZeroPassed,
            activeRoles: appState.monthlyRoleGoals.map((r) => r.roleName),
          },
        }),
      });

      if (!response.ok) throw new Error('Steward server error');
      const data = await response.json();

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.reply || 'Execution precedes motivation. What is the single output unit you will ship next?',
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'The Steward is grounded in silence. Focus on shipping your current Minimum Viable Action.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'I feel heavy task resistance right now.',
    'Help me formulate my Single Adjustment.',
    'I caught myself in a Thinking Loop.',
    'Audit today’s friction as usable data.',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#111111] border-l border-[#262626] shadow-2xl flex flex-col backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#0A0A0A]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#161616] text-[#5FBF8C] border border-[#262626]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif text-[#E0E0E0]">
              AI Steward Intelligence
            </h3>
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#5FBF8C]">
              Monastic Objective Counsel
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-[#808080] hover:text-[#E0E0E0] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2.5 bg-[#0A0A0A] border-b border-[#262626] flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 bg-[#161616] hover:bg-[#222222] text-[#808080] hover:text-[#5FBF8C] border border-[#262626] flex-shrink-0 transition-colors uppercase font-mono tracking-wider text-[9px]"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3.5 ${
                m.role === 'user'
                  ? 'bg-[#5FBF8C] text-black font-medium shadow-sm'
                  : 'bg-[#0A0A0A] border border-[#262626] text-[#E0E0E0] font-serif leading-relaxed'
              }`}
            >
              {m.content}
            </div>
            <span className="text-[9px] font-mono text-[#666] mt-1 px-1 tracking-widest uppercase">
              {m.role === 'user' ? 'You' : 'Steward'}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-[#808080] text-xs p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5FBF8C]" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Calibrating objective counsel...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-[#262626] bg-[#0A0A0A]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Steward..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#111111] border border-[#262626] text-xs text-[#E0E0E0] placeholder-[#555] focus:outline-none focus:border-[#5FBF8C]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-[#5FBF8C] hover:bg-[#7FD1A6] disabled:opacity-40 text-black transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
