import { ArrowRight } from 'lucide-react';

interface CompletionScreenProps {
  onViewResults: () => void;
}

export default function CompletionScreen({ onViewResults }: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto animate-fade-in-up">
        {/* Checkmark animation */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          {/* Outer glow */}
          <div className="absolute inset-[-12px] rounded-full bg-emerald-500/10 animate-orb-pulse" />
          <div className="absolute inset-[-6px] rounded-full bg-emerald-500/15 animate-orb-pulse" style={{ animationDelay: '0.3s' }} />

          {/* Circle */}
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              opacity="0.3"
            />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              className="animate-circle-draw"
            />
            {/* Checkmark */}
            <path
              d="M38 62 L52 76 L82 46"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-check-draw"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Interview Complete</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Great job! Your responses have been recorded. Our AI is ready to generate your comprehensive skill assessment.
        </p>

        <button
          onClick={onViewResults}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm rounded-2xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          View Results
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
