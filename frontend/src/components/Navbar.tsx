import { Brain, Sparkles } from 'lucide-react';
import { Stage } from '../types';

interface NavbarProps {
  stage: Stage;
  onReset: () => void;
}

const STAGE_LABELS: Record<Stage, string> = {
  input: 'Setup',
  interview: 'Interview',
  completion: 'Complete',
  analysis: 'Analysis',
  results: 'Results',
  roadmap: 'Learning Plan',
};

const VISIBLE_STAGES: Stage[] = ['input', 'interview', 'results', 'roadmap'];

export default function Navbar({ stage, onReset }: NavbarProps) {
  const currentVisible = stage === 'completion' || stage === 'analysis' ? 'results' : stage;
  const currentIndex = VISIBLE_STAGES.indexOf(currentVisible);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm tracking-wide">SkillForge AI</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {VISIBLE_STAGES.map((s, i) => {
              const isCompleted = i < currentIndex;
              const isActive = s === currentVisible;

              return (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : isCompleted
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      isActive ? 'bg-blue-400' : isCompleted ? 'bg-emerald-400' : 'bg-slate-700'
                    }`} />
                    {STAGE_LABELS[s]}
                  </div>
                  {i < VISIBLE_STAGES.length - 1 && (
                    <div className={`w-6 h-px mx-1 transition-colors duration-300 ${isCompleted ? 'bg-slate-600' : 'bg-slate-800'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400 font-medium hidden sm:block">Powered by Gemini</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
