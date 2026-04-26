import { useEffect, useState } from 'react';
import {
  TrendingUp, TrendingDown, MessageSquare, ArrowRight, BarChart3,
  LayoutDashboard, Cpu, FileCheck, BookOpen, Sparkles, Target, AlertTriangle
} from 'lucide-react';
import { AssessmentResult, ResultTab, RoadmapStep } from '../types';
import SkillBar from './SkillBar';
import RoadmapStepComponent from './RoadmapStep';

interface ResultsDashboardProps {
  result: AssessmentResult;
  roadmap: RoadmapStep[];
  onViewRoadmap: () => void;
  onToggleStep: (id: string) => void;
}

function ScoreRing({ score, size = 120, label, color }: { score: number; size?: number; label?: string; color?: string }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 2;
      setDisplayScore(Math.min(start, score));
      if (start < score) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeColor = color ?? (score >= 75 ? '#22d3ee' : score >= 55 ? '#f59e0b' : '#f87171');

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={strokeColor} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.05s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{displayScore}</span>
        {label && <span className="text-xs text-slate-400">{label}</span>}
      </div>
    </div>
  );
}

const TABS: { id: ResultTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'skills', label: 'Skills Analysis', icon: Cpu },
  { id: 'ats', label: 'ATS Score', icon: FileCheck },
  { id: 'learning', label: 'Learning Plan', icon: BookOpen },
];

export default function ResultsDashboard({ result, roadmap, onViewRoadmap, onToggleStep }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>('overview');
  const skills = result.skills || [];

const strengths = skills.filter(s => s.score >= 65);
const weaknesses = skills.filter(s => s.score < 65);
const sortedSkills = [...skills].sort((a, b) => b.score - a.score);
const strongestSkill = sortedSkills[0];
const weakestSkill = [...skills].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <BarChart3 className="w-3 h-3" />
            Assessment Complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Skill Report</h1>
          <p className="text-slate-400 text-sm">Based on your interview responses and resume analysis</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/60 border border-white/8 rounded-xl mb-6 overflow-x-auto backdrop-blur-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score card */}
              <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6 sm:p-8 backdrop-blur-sm hover:border-white/12 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <ScoreRing score={result.overallScore} size={140} label="/ 100" />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-4xl font-bold text-white mb-1">
                      {result.overallScore >= 80 ? 'Excellent' : result.overallScore >= 65 ? 'Good' : result.overallScore >= 50 ? 'Fair' : 'Needs Work'}
                    </div>
                    <p className="text-slate-400 text-sm mb-5">Overall Skill Match</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-white/5">
                        <p className="text-lg font-bold text-white">{strengths.length}</p>
                        <p className="text-xs text-slate-400">Strengths</p>
                      </div>
                      <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-white/5">
                        <p className="text-lg font-bold text-white">{weaknesses.length}</p>
                        <p className="text-xs text-slate-400">Gaps</p>
                      </div>
                      <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-white/5">
                        <p className="text-lg font-bold text-white">{skills.length}</p>
                        <p className="text-xs text-slate-400">Skills</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-emerald-500/15 rounded-2xl p-5 backdrop-blur-sm hover:border-emerald-500/25 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Strongest Skill</h3>
                  </div>
                  <p className="text-emerald-300 font-medium text-lg mb-1">{strongestSkill?.name || 'N/A'}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {strongestSkill ? `Scored ${strongestSkill.score}/100 — ${strongestSkill.score >= 85 ? 'expert level' : 'proficient level'} performance` : 'No strong skills identified'}
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-rose-500/15 rounded-2xl p-5 backdrop-blur-sm hover:border-rose-500/25 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Needs Improvement</h3>
                  </div>
                  <p className="text-rose-300 font-medium text-lg mb-1">{weakestSkill?.name || 'N/A'}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {weakestSkill ? `Scored ${weakestSkill.score}/100 — focus area for your learning plan` : 'No weak areas identified'}
                  </p>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-slate-900/60 border border-blue-500/15 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/25 transition-colors duration-300">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">AI Feedback</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
  {typeof result.aiFeedback === "string"
    ? result.aiFeedback
    : JSON.stringify(result.aiFeedback, null, 2)}
</p>
              </div>
            </div>
          )}

          {/* SKILLS ANALYSIS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Skills Breakdown</h2>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> High</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Medium</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Low</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {skills.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill} delay={i * 80} />
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses detail */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-emerald-500/15 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/25 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white">Strengths</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(result.strengths?.length ? result.strengths : strengths.map(s => s.name)).map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 leading-relaxed">
  {typeof s === "string" ? s : JSON.stringify(s)}
</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/60 border border-rose-500/15 rounded-2xl p-6 backdrop-blur-sm hover:border-rose-500/25 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <h3 className="font-semibold text-white">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(result.weaknesses?.length ? result.weaknesses : weaknesses.map(s => s.name)).map((w, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 leading-relaxed">
  {typeof w === "string" ? w : JSON.stringify(w)}
</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ATS SCORE TAB */}
          {activeTab === 'ats' && (
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-white/8 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <ScoreRing score={result.atsScore} size={160} label="ATS Score" color={result.atsScore >= 70 ? '#22d3ee' : result.atsScore >= 50 ? '#f59e0b' : '#f87171'} />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">ATS Compatibility</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {result.atsScore >= 80
                        ? 'Your resume is well-optimized for Applicant Tracking Systems. Most keywords and formatting are in place.'
                        : result.atsScore >= 60
                        ? 'Your resume has moderate ATS compatibility. Some keywords and formatting improvements could boost your chances.'
                        : 'Your resume needs significant optimization for ATS. Consider adding more relevant keywords and restructuring.'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-300">Based on job description keyword matching</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ATS Strengths */}
                <div className="bg-slate-900/60 border border-emerald-500/15 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white">ATS Strengths</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(result.strengths || []).slice(0, 4).map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 leading-relaxed">{s}</span>
                      </li>
                    ))}
                    {(!result.strengths || result.strengths.length === 0) && <li>NO ATS Strengths Identified</li>}
                  </ul>
                </div>

                {/* ATS Improvements */}
                <div className="bg-slate-900/60 border border-rose-500/15 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <h3 className="font-semibold text-white">ATS Improvements</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(result.weaknesses || []).slice(0, 4).map((w, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 leading-relaxed">{w}</span>
                      </li>
                    ))}
                    {(!result.weaknesses || result.weaknesses.length === 0) && <li>NO ATS Improvements Needed</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* LEARNING PLAN TAB */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              {roadmap.length > 0 ? (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Total Steps', value: roadmap.length.toString() },
                      { label: 'Completed', value: roadmap.filter(s => s.completed).length.toString() },
                      { label: 'High Priority', value: roadmap.filter(s => s.priority === 'high').length.toString() },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-900/60 border border-white/8 rounded-2xl p-4 text-center backdrop-blur-sm">
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Roadmap */}
                  <div>
                    {roadmap.map((step, i) => (
                      <RoadmapStepComponent
                        key={step.id}
                        step={step}
                        index={i}
                        isLast={i === roadmap.length - 1}
                        onToggle={() => onToggleStep(step.id)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-slate-900/60 border border-white/8 rounded-2xl backdrop-blur-sm">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm mb-4">Your learning roadmap hasn't been generated yet.</p>
                  <button
                    onClick={onViewRoadmap}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Generate Learning Plan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
