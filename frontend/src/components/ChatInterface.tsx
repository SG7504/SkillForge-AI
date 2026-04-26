import { useEffect, useRef, useState } from 'react';
import { Send, Brain, AlertCircle } from 'lucide-react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (text: string) => void;
  isTyping: boolean;
  isLoading: boolean;
  questionNumber: number;
  totalQuestions: number;
  onComplete: () => void;
  isComplete: boolean;
}

export default function ChatInterface({
  messages,
  onSend,
  isTyping,
  isLoading,
  questionNumber,
  totalQuestions,
  onComplete,
  isComplete,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  function handleSend() {
    const text = input.trim();
    if (!text || isTyping || isLoading) return;
    setInput('');
    onSend(text);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }

  const progress = Math.min((questionNumber / totalQuestions) * 100, 100);

  return (
    <div className="flex flex-col h-screen bg-slate-950 pt-16">
      {/* Chat header */}
      <div className="border-b border-white/8 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-glow">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Interviewer</p>
            <p className="text-xs text-emerald-400">Active · Skill Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-500">Question {Math.min(questionNumber, totalQuestions)} of {totalQuestions}</span>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {isComplete && (
            <button
              onClick={onComplete}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.97]"
            >
              View Results
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.length === 0 && !isTyping && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-glow">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-slate-400 text-sm">Preparing your personalized interview...</p>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/8 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {isComplete ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-fade-in">
              <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-emerald-300">Interview complete. Click <strong>View Results</strong> to see your assessment.</p>
            </div>
          ) : (
            <div className={`flex items-end gap-3 bg-slate-900/80 border rounded-2xl px-4 py-3 transition-all duration-200 ${
              input.length > 0 ? 'border-blue-500/30 shadow-lg shadow-blue-500/5' : 'border-white/8'
            }`}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
                disabled={isTyping || isLoading}
                rows={1}
                className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none leading-relaxed disabled:opacity-50"
                style={{ minHeight: '24px', maxHeight: '140px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isLoading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  input.trim() && !isTyping && !isLoading
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-110 active:scale-95'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-slate-600 mt-2 text-center">
            Be honest and detailed. Your responses shape your personalized learning plan.
          </p>
        </div>
      </div>
    </div>
  );
}
