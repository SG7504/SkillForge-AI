export type Stage = 'input' | 'interview' | 'completion' | 'analysis' | 'results' | 'roadmap';

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

export type ResultTab = 'overview' | 'skills' | 'ats' | 'learning';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface SkillScore {
  name: string;
  score: number;
  category: 'strength' | 'weakness' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
}

export interface AssessmentResult {
  overallScore: number;
  atsScore: number;
  skills: SkillScore[];
  strengths: string[];
  weaknesses: string[];
  aiFeedback: string;
  strongestSkill: string;
  weakestSkill: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  week: string;
  resources: string[];
  priority: 'high' | 'medium' | 'low';
  tags: ('project' | 'course' | 'practice')[];
  completed: boolean;
}

export interface SessionData {
  jobDescription: string;
  resume: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  resumeFileName: string;
  jdFileName: string;
  messages: Message[];
  result: AssessmentResult | null;
  roadmap: RoadmapStep[];
}
