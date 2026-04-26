import { useEffect, useState } from 'react';
import { SkillScore } from '../types';

interface SkillBarProps {
  skill: SkillScore;
  delay?: number;
}

function getBarColor(score: number, category: SkillScore['category']) {
  if (category === 'strength' || score >= 75) return 'from-blue-500 to-cyan-400';
  if (category === 'weakness' || score < 55) return 'from-rose-500 to-orange-400';
  return 'from-amber-500 to-yellow-400';
}

function getLevelLabel(score: number) {
  if (score >= 85) return 'Expert';
  if (score >= 70) return 'Proficient';
  if (score >= 55) return 'Developing';
  return 'Beginner';
}

const CONFIDENCE_CONFIG = {
  high: { color: 'bg-emerald-400', label: 'High confidence', textColor: 'text-emerald-400' },
  medium: { color: 'bg-amber-400', label: 'Medium confidence', textColor: 'text-amber-400' },
  low: { color: 'bg-rose-400', label: 'Low confidence', textColor: 'text-rose-400' },
};

export default function SkillBar({ skill, delay = 0 }: SkillBarProps) {
  const [width, setWidth] = useState(0);
  const confidence = CONFIDENCE_CONFIG[skill.confidence] ?? CONFIDENCE_CONFIG.medium;

  useEffect(() => {
    const timer = setTimeout(() => setWidth(skill.score), delay + 100);
    return () => clearTimeout(timer);
  }, [skill.score, delay]);

  const barColor = getBarColor(skill.score, skill.category);

  return (
    <div className="group py-2">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
            {skill.name}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${confidence.color}`} title={confidence.label} />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500">{getLevelLabel(skill.score)}</span>
          <span className={`text-sm font-bold bg-gradient-to-r ${barColor} bg-clip-text text-transparent`}>
            {skill.score}
          </span>
        </div>
      </div>
      <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
