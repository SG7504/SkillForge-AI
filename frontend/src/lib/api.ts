// src/lib/api.ts

let questionIndex = 0;

const questions = [
  "Explain how you would design a REST API for a scalable application.",
  "How do you handle authentication and authorization in a backend system?",
  "What are database indexing strategies and how do they improve performance?",
  "How do you handle concurrency issues in backend systems?",
  "What is the difference between monolithic and microservices architecture?",
  "How do you optimize backend performance under high load?"
];

export async function startInterview(): Promise<string> {
  questionIndex = 0;
  return questions[questionIndex];
}

export async function sendMessage(): Promise<string> {
  questionIndex++;

  if (questionIndex < questions.length) {
    return questions[questionIndex];
  }

  return "Thank you. That concludes the interview.";
}

export async function analyzeResponses() {
  return {
    overallScore: 78,
    atsScore: 70,
    skills: [
      { name: 'JavaScript', score: 80, category: 'strength', confidence: 'high' },
      { name: 'Node.js', score: 75, category: 'strength', confidence: 'high' },
      { name: 'System Design', score: 60, category: 'weakness', confidence: 'medium' },
    ],
    strengths: ['Strong backend fundamentals', 'Good API understanding'],
    weaknesses: ['System design', 'Scalability concepts'],
    aiFeedback: [
      {
        id: 'step-1',
        title: 'Strengthen Backend Fundamentals',
        description: 'Focus on APIs, databases, and request handling.',
      },
      {
        id: 'step-2',
        title: 'Build Scalable Systems',
        description: 'Learn system design and scalability patterns.',
      }
    ],
    strongestSkill: 'Node.js',
    weakestSkill: 'System Design',
  };
}

export async function generateRoadmap() {
  return [
    {
      id: 'step-1',
      title: 'Backend Basics',
      description: 'Learn APIs and server fundamentals',
      duration: '1-2 weeks',
      week: 'Week 1',
      resources: [
        'https://nodejs.org/en/docs',
        'https://restfulapi.net/'
      ],
      priority: 'high',
      tags: ['practice'],
      completed: false,
    },
    {
      id: 'step-2',
      title: 'Build a Project',
      description: 'Create a backend project from scratch',
      duration: '2-3 weeks',
      week: 'Week 2-4',
      resources: [
        'https://www.freecodecamp.org/news/build-a-crud-app-with-nodejs/',
        'https://www.mongodb.com/docs/'
      ],
      priority: 'medium',
      tags: ['project'],
      completed: false,
    }
  ];
}