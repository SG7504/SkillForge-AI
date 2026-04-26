import { useState, useCallback } from 'react';
import { Stage, Message, SessionData, ExperienceLevel } from './types';
import { startInterview, sendMessage, analyzeResponses, generateRoadmap } from './lib/api';
import Navbar from './components/Navbar';
import InputPanel from './components/InputPanel';
import ChatInterface from './components/ChatInterface';
import CompletionScreen from './components/CompletionScreen';
import AnalysisLoader from './components/AnalysisLoader';
import ResultsDashboard from './components/ResultsDashboard';
import LearningRoadmap from './components/LearningRoadmap';

const TOTAL_QUESTIONS = 6;

function createMessage(role: 'ai' | 'user', content: string): Message {
  return { id: crypto.randomUUID(), role, content, timestamp: new Date() };
}

const DEFAULT_SESSION: SessionData = {
  jobDescription: '',
  resume: '',
  targetRole: '',
  experienceLevel: 'mid',
  resumeFileName: '',
  jdFileName: '',
  messages: [],
  result: null,
  roadmap: [],
};

export default function App() {
  const [stage, setStage] = useState<Stage>('input');
  const [session, setSession] = useState<SessionData>(DEFAULT_SESSION);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);

  const handleStart = useCallback(async (
    jobDescription: string,
    resume: string,
    targetRole: string,
    experienceLevel: ExperienceLevel,
    resumeFileName: string,
    jdFileName: string
  ) => {
    setIsLoading(true);
    try {
      const firstQuestion = await startInterview(jobDescription, resume, targetRole, experienceLevel);
      const aiMsg = createMessage('ai', firstQuestion);
      setSession({
        jobDescription,
        resume,
        targetRole,
        experienceLevel,
        resumeFileName,
        jdFileName,
        messages: [aiMsg],
        result: null,
        roadmap: [],
      });
      setQuestionNumber(1);
      setIsInterviewComplete(false);
      setStage('interview');
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Failed to start the interview. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg = createMessage('user', text);

    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }));

    setIsTyping(true);

    try {
      const currentQ = questionNumber;
      const history = session.messages.map((m) => ({ role: m.role, content: m.content }));

      const aiResponse = await sendMessage(
        session.jobDescription,
        session.resume,
        session.targetRole,
        history,
        text,
        currentQ,
        TOTAL_QUESTIONS
      );

      const aiMsg = createMessage('ai', aiResponse);
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
      }));

      const nextQ = currentQ + 1;
      setQuestionNumber(nextQ);

      if (nextQ > TOTAL_QUESTIONS) {
        setIsInterviewComplete(true);
      }
    } catch (err) {
      console.error('Failed to get AI response:', err);
      const errorMsg = createMessage('ai', 'I apologize, I encountered an issue. Please try again.');
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMsg],
      }));
    } finally {
      setIsTyping(false);
    }
  }, [session, questionNumber]);

  const handleComplete = useCallback(() => {
    setStage('completion');
  }, []);

  const handleViewResults = useCallback(async () => {
    setStage('analysis');

    try {
      const history = session.messages.map((m) => ({ role: m.role, content: m.content }));
      const result = await analyzeResponses(session.jobDescription, session.resume, session.targetRole, history);
      setSession((prev) => ({ ...prev, result }));
      setStage('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setSession((prev) => ({
        ...prev,
        result: {
          overallScore: 70,
          atsScore: 60,
          skills: [
            { name: 'Technical Skills', score: 72, category: 'neutral', confidence: 'medium' },
            { name: 'Communication', score: 68, category: 'neutral', confidence: 'medium' },
            { name: 'Problem Solving', score: 75, category: 'strength', confidence: 'high' },
          ],
          strengths: ['Good technical foundation', 'Clear communication'],
          weaknesses: ['Could improve domain expertise'],
          aiFeedback: 'Unable to generate detailed feedback. Please try again.',
          strongestSkill: 'Problem Solving',
          weakestSkill: 'Domain Expertise',
        },
      }));
      setStage('results');
    }
  }, [session]);

  const handleViewRoadmap = useCallback(async () => {
    if (!session.result) return;

    if (session.roadmap.length > 0) {
      setStage('roadmap');
      return;
    }

    setStage('analysis');
    try {
      const roadmap = await generateRoadmap(session.jobDescription, session.targetRole, session.result);
      setSession((prev) => ({ ...prev, roadmap }));
      setStage('roadmap');
    } catch (err) {
      console.error('Roadmap generation failed:', err);
      setSession((prev) => ({
        ...prev,
        roadmap: [
          {
            id: 'step-1',
            title: 'Skill Gap Analysis',
            description: 'Review the identified skill gaps and create a study plan.',
            duration: '1 week',
            week: 'Week 1',
            resources: ['Online courses', 'Documentation', 'Practice projects'],
            priority: 'high',
            tags: ['course', 'practice'],
            completed: false,
          },
        ],
      }));
      setStage('roadmap');
    }
  }, [session]);

  const handleToggleStep = useCallback((id: string) => {
    setSession((prev) => ({
      ...prev,
      roadmap: prev.roadmap.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      ),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setStage('input');
    setSession(DEFAULT_SESSION);
    setQuestionNumber(0);
    setIsTyping(false);
    setIsLoading(false);
    setIsInterviewComplete(false);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar stage={stage} onReset={handleReset} />

      {stage === 'input' && (
        <InputPanel onStart={handleStart} isLoading={isLoading} />
      )}

      {stage === 'interview' && (
        <ChatInterface
          messages={session.messages}
          onSend={handleSendMessage}
          isTyping={isTyping}
          isLoading={isLoading}
          questionNumber={questionNumber}
          totalQuestions={TOTAL_QUESTIONS}
          onComplete={handleComplete}
          isComplete={isInterviewComplete}
        />
      )}

      {stage === 'completion' && (
        <CompletionScreen onViewResults={handleViewResults} />
      )}

      {stage === 'analysis' && <AnalysisLoader />}

      {stage === 'results' && session.result && (
        <ResultsDashboard
          result={session.result}
          roadmap={session.roadmap}
          onViewRoadmap={handleViewRoadmap}
          onToggleStep={handleToggleStep}
        />
      )}

      {stage === 'roadmap' && (
        <LearningRoadmap
          steps={session.roadmap}
          onRestart={handleReset}
          onToggleStep={handleToggleStep}
        />
      )}
    </div>
  );
}
