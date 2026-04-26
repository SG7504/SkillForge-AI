import { BookOpen, RefreshCw, Map, CheckCircle2 } from 'lucide-react';
import { RoadmapStep as RoadmapStepType } from '../types';
import RoadmapStep from './RoadmapStep';

interface LearningRoadmapProps {
  steps: RoadmapStepType[];
  onRestart: () => void;
  onToggleStep: (id: string) => void;
}

export default function LearningRoadmap({ steps, onRestart, onToggleStep }: LearningRoadmapProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <Map className="w-3 h-3" />
            Personalized Learning Plan
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Growth Roadmap</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            A tailored learning path designed to close your skill gaps and maximize your potential.
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-5 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">{completedCount} of {steps.length} completed</span>
            </div>
            <span className="text-sm font-bold text-blue-400">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Steps', value: steps.length.toString(), icon: BookOpen },
            { label: 'Completed', value: completedCount.toString(), icon: CheckCircle2 },
            { label: 'High Priority', value: steps.filter(s => s.priority === 'high').length.toString(), icon: Map },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-slate-900/60 border border-white/8 rounded-2xl p-4 text-center backdrop-blur-sm hover:border-white/12 transition-colors duration-300">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Roadmap steps */}
        <div>
          {steps.map((step, i) => (
            <RoadmapStep
              key={step.id}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
              onToggle={() => onToggleStep(step.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-500/15 rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Start Your Journey?</h3>
          <p className="text-slate-400 text-sm mb-5 leading-relaxed max-w-sm mx-auto">
            Work through each step at your own pace. Click the step number to mark it complete.
          </p>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 border border-white/10 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 hover:text-white hover:border-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
