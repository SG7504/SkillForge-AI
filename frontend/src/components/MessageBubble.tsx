import { Brain, User } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'ai';

  if (isAI) {
    return (
      <div className="flex items-end gap-3 animate-fade-in-up">
        {/* AI avatar - glowing orb */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 relative">
          <Brain className="w-4 h-4 text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
        </div>
        <div className="max-w-[75%] group">
          <div className="bg-slate-800/80 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3.5 backdrop-blur-sm hover:border-white/12 transition-colors duration-200">
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-slate-600 text-xs mt-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            AI Interviewer · {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 justify-end animate-fade-in-up">
      <div className="max-w-[75%] group">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl rounded-br-sm px-4 py-3.5 shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-shadow duration-200">
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-slate-600 text-xs mt-1.5 mr-1 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          You · {formatTime(message.timestamp)}
        </p>
      </div>
      {/* User avatar */}
      <div className="w-9 h-9 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-slate-300" />
      </div>
    </div>
  );
}
