import { useState, useRef } from 'react';
import { FileText, Briefcase, ArrowRight, Zap, ChevronDown, Upload, X, Brain, Target, BarChart3 } from 'lucide-react';
import { ExperienceLevel } from '../types';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

async function extractTextFromPDF(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  console.log("PDF loaded, pages:", pdf.numPages);

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");

    text += pageText + "\n";
  }

  return text;
}

interface InputPanelProps {
  onStart: (jobDescription: string, resume: string, targetRole: string, experienceLevel: ExperienceLevel, resumeFileName: string, jdFileName: string) => void;
  isLoading: boolean;
}

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'ML Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Mobile Developer',
  'Cloud Architect',
  'Security Engineer',
  'QA Engineer',
  'Other',
];

const EXPERIENCE: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level (0-2 yrs)' },
  { value: 'mid', label: 'Mid Level (3-5 yrs)' },
  { value: 'senior', label: 'Senior (6-10 yrs)' },
  { value: 'lead', label: 'Lead / Staff (10+ yrs)' },
  { value: 'executive', label: 'Executive / VP+' },
];

export default function InputPanel({ onStart, isLoading }: InputPanelProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('mid');
  const [resumeFileName, setResumeFileName] = useState('');
  const [jdFileName, setJdFileName] = useState('');
  const [activeField, setActiveField] = useState<'job' | 'resume' | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  const canStart = jobDescription.trim().length > 50 && resume.trim().length > 50 && targetRole.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canStart || isLoading) return;
    onStart(jobDescription.trim(), resume.trim(), targetRole, experienceLevel, resumeFileName, jdFileName);
  }

async function handleFileUpload(file: File, type: 'resume' | 'jd') {
  let text = "";

  if (file.name.toLowerCase().endsWith(".pdf")) {
    text = await extractTextFromPDF(file);
  } else {
    text = await file.text();
  }

  if (type === "resume") {
    setResume(text);
    setResumeFileName(file.name);
  } else {
    setJobDescription(text);
    setJdFileName(file.name);
  }
}

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered Skill Assessment
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Discover Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              True Potential
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Upload your resume and job description. Our AI conducts a personalized interview and builds your custom learning roadmap.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
          {[
            { icon: Brain, label: 'AI Interview' },
            { icon: Target, label: 'Skill Scoring' },
            { icon: BarChart3, label: 'Learning Plan' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 py-3 px-4 bg-slate-900/40 border border-white/6 rounded-xl">
              <Icon className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-slate-400 font-medium">{label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dropdowns row */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Target Role */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Role</label>
              <button
                type="button"
                onClick={() => { setRoleOpen(!roleOpen); setExpOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 border border-white/8 rounded-xl text-sm text-left hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
              >
                <span className={targetRole ? 'text-white' : 'text-slate-500'}>{targetRole || 'Select a role...'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`} />
              </button>
              {roleOpen && (
                <div className="absolute z-20 mt-1 w-full bg-slate-900 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden animate-fade-in">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setTargetRole(role); setRoleOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-blue-500/10 hover:text-blue-300 ${targetRole === role ? 'text-blue-400 bg-blue-500/5' : 'text-slate-300'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Experience Level</label>
              <button
                type="button"
                onClick={() => { setExpOpen(!expOpen); setRoleOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 border border-white/8 rounded-xl text-sm text-left hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
              >
                <span className="text-white">{EXPERIENCE.find(e => e.value === experienceLevel)?.label}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expOpen ? 'rotate-180' : ''}`} />
              </button>
              {expOpen && (
                <div className="absolute z-20 mt-1 w-full bg-slate-900 border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden animate-fade-in">
                  {EXPERIENCE.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setExperienceLevel(value); setExpOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-blue-500/10 hover:text-blue-300 ${experienceLevel === value ? 'text-blue-400 bg-blue-500/5' : 'text-slate-300'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Text areas */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Job Description */}
            <div className={`group relative rounded-2xl border transition-all duration-300 ${
              activeField === 'job'
                ? 'border-blue-500/40 shadow-lg shadow-blue-500/10'
                : 'border-white/8 hover:border-white/15 hover:shadow-lg hover:shadow-black/20'
            } bg-slate-900/60 backdrop-blur-sm`}>
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Job Description</p>
                      <p className="text-xs text-slate-500">Paste or upload the job posting</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {jdFileName && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                        <FileText className="w-3 h-3" />
                        {jdFileName.length > 16 ? jdFileName.slice(0, 16) + '...' : jdFileName}
                        <button type="button" onClick={() => { setJdFileName(''); setJobDescription(''); }} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => jdInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-white/8 text-slate-400 text-xs rounded-lg hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </button>
                    <input
                      ref={jdInputRef}
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'jd');
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  onFocus={() => setActiveField('job')}
                  onBlur={() => setActiveField(null)}
                  placeholder="Paste the job description here...

Example:
We are looking for a Senior React Developer with 5+ years of experience in building scalable web applications..."
                  className="w-full h-48 bg-slate-950/50 rounded-xl border border-white/6 text-slate-200 placeholder-slate-600 text-sm p-4 resize-none focus:outline-none focus:border-blue-500/40 focus:bg-slate-950/80 transition-all duration-200 leading-relaxed"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-600">Min. 50 characters</span>
                  <span className={`text-xs ${jobDescription.length >= 50 ? 'text-blue-400' : 'text-slate-600'}`}>
                    {jobDescription.length} chars
                  </span>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className={`group relative rounded-2xl border transition-all duration-300 ${
              activeField === 'resume'
                ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'border-white/8 hover:border-white/15 hover:shadow-lg hover:shadow-black/20'
            } bg-slate-900/60 backdrop-blur-sm`}>
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Your Resume</p>
                      <p className="text-xs text-slate-500">Paste or upload your CV</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {resumeFileName && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                        <FileText className="w-3 h-3" />
                        {resumeFileName.length > 16 ? resumeFileName.slice(0, 16) + '...' : resumeFileName}
                        <button type="button" onClick={() => { setResumeFileName(''); setResume(''); }} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-white/8 text-slate-400 text-xs rounded-lg hover:border-cyan-500/30 hover:text-cyan-300 transition-all duration-200"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </button>
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'resume');
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  onFocus={() => setActiveField('resume')}
                  onBlur={() => setActiveField(null)}
                  placeholder="Paste your resume here...

Example:
John Doe | john@email.com | github.com/johndoe

EXPERIENCE
Senior Developer at TechCorp (2020-2024)
- Led team of 8 engineers..."
                  className="w-full h-48 bg-slate-950/50 rounded-xl border border-white/6 text-slate-200 placeholder-slate-600 text-sm p-4 resize-none focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950/80 transition-all duration-200 leading-relaxed"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-600">Min. 50 characters</span>
                  <span className={`text-xs ${resume.length >= 50 ? 'text-cyan-400' : 'text-slate-600'}`}>
                    {resume.length} chars
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!canStart || isLoading}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                canStart && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Preparing Interview...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Start AI Interview
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
