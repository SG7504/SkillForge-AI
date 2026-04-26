import { Clock, ExternalLink, ChevronDown, CheckCircle2, Circle, Tag } from 'lucide-react';
import { useState } from 'react';
import { RoadmapStep as RoadmapStepType } from '../types';

interface RoadmapStepProps {
  step: RoadmapStepType;
  index: number;
  isLast: boolean;
  onToggle: () => void;
}

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-400' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-400' },
};

const TAG_CONFIG = {
  project: { label: 'Project', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  course: { label: 'Course', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  practice: { label: 'Practice', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
};

export default function RoadmapStep({ step, index, isLast, onToggle }: RoadmapStepProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const priority = PRIORITY_CONFIG[step.priority] ?? PRIORITY_CONFIG.medium;

  function handleToggleComplete() {
    onToggle();
  }

  return (
    <div className="relative flex gap-5">
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={handleToggleComplete}
          className="z-10 transition-all duration-200 hover:scale-110"
        >
          {step.completed ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-500/20">
              {index + 1}
            </div>
          )}
        </button>
        {!isLast && (
          <div className={`w-px flex-1 mt-2 min-h-8 transition-colors duration-300 ${step.completed ? 'bg-emerald-500/30' : 'bg-gradient-to-b from-blue-500/30 to-transparent'}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div
          className={`group bg-slate-900/60 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 backdrop-blur-sm ${
            step.completed ? 'border-emerald-500/20 hover:border-emerald-500/30' : 'border-white/8 hover:border-blue-500/20'
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priority.bg} ${priority.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                    {priority.label}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </span>

                  {step.week && (
                    <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
                      {step.week}
                    </span>
                  )}

                  {/* ✅ SAFE TAGS */}
                  {Array.isArray(step.tags) &&
                    step.tags.map((tag) => {
                      const config = TAG_CONFIG[tag] || TAG_CONFIG.practice;
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {config.label}
                        </span>
                      );
                    })}
                </div>

                <h3 className={`font-semibold text-base transition-colors duration-200 ${
                  step.completed
                    ? 'text-emerald-300 line-through decoration-emerald-500/40'
                    : 'text-white group-hover:text-blue-300'
                }`}>
                  {step.title}
                </h3>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </div>

            {expanded && (
              <div className="mt-4 pt-4 border-t border-white/6 animate-fade-in">

                {/* ✅ SAFE DESCRIPTION */}
                <p className="text-sm text-slate-400 mb-4">
                  {typeof step.description === "string"
                    ? step.description
                    : JSON.stringify(step.description)}
                </p>

                {/* ✅ SAFE RESOURCES */}
                {Array.isArray(step.resources) && step.resources.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Resources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.resources.map((resource, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-white/8 text-slate-300 text-xs rounded-lg hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200 cursor-default"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {typeof resource === "string"
                            ? resource
                            : JSON.stringify(resource)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleComplete();
                  }}
                  className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    step.completed
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-slate-800/80 border border-white/8 text-slate-400 hover:text-white hover:border-blue-500/30'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                  {step.completed ? 'Completed' : 'Mark Complete'}
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}