import { Brain } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      {/* AI avatar - glowing orb */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 relative">
        <Brain className="w-4 h-4 text-white" />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
      </div>
      <div className="bg-slate-800/80 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
