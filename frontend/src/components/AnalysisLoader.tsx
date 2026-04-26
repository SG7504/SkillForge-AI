import { useEffect, useState } from 'react';
import { Brain, BarChart3, Sparkles, BookOpen } from 'lucide-react';

const STEPS = [
  { icon: Brain, label: 'Analyzing resume...', delay: 0 },
  { icon: Sparkles, label: 'Generating questions...', delay: 2000 },
  { icon: BarChart3, label: 'Scoring skill dimensions...', delay: 4000 },
  { icon: BookOpen, label: 'Building learning roadmap...', delay: 6000 },
];

export default function AnalysisLoader() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers = STEPS.map((step, i) => {
      const t = setTimeout(() => {
        setActiveStep(i);
        if (i > 0) setCompletedSteps((prev) => [...prev, i - 1]);
      }, step.delay);
      return t;
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Glowing orb */}
        <div className="relative mx-auto w-32 h-32 mb-12">
          {/* Outer pulse rings */}
          <div className="absolute inset-[-16px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 animate-orb-pulse" />
          <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-400/15 animate-orb-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Rotating ring */}
          <div className="absolute inset-[-4px] rounded-full animate-orb-ring">
            <svg viewBox="0 0 140 140" className="w-full h-full">
              <circle cx="70" cy="70" r="66" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeDasharray="8 12" opacity="0.6" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Core orb */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-glow">
            <Brain className="w-14 h-14 text-white drop-shadow-lg" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Analyzing Your Skills</h2>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed">
          Our AI is processing your responses and building a comprehensive skill profile.
        </p>

        {/* Steps */}
        <div className="space-y-3 text-left mb-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(i);
            const isActive = activeStep === i;

            return (
              <div
                key={i}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-500 ${
                  isCompleted
                    ? 'bg-emerald-500/8 border-emerald-500/20'
                    : isActive
                    ? 'bg-blue-500/10 border-blue-500/25 shadow-lg shadow-blue-500/5'
                    : 'bg-slate-900/40 border-white/5 opacity-40'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500/20'
                    : isActive
                    ? 'bg-blue-500/20'
                    : 'bg-slate-800'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isCompleted ? 'text-emerald-300' : isActive ? 'text-white' : 'text-slate-600'
                }`}>
                  {step.label}
                </span>
                {isActive && !isCompleted && (
                  <div className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
            style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 mt-2">This may take a few moments</p>
      </div>
    </div>
  );
}
