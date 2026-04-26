import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeAI } from "../utils/safeAI.js";
import { extractJSON } from "../utils/utils.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generatePlan(answers) {
  return await safeAI(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an expert career coach and technical mentor.

Based on the candidate's interview performance below, create a HIGH-QUALITY, PRACTICAL learning roadmap.

Candidate skill evaluations:
${JSON.stringify(answers, null, 2)}

Instructions:
- Focus MORE on weak skills (low scores)
- Give SPECIFIC, ACTIONABLE steps
- Avoid generic advice like "practice more"
- Include REALISTIC tasks (projects, exercises, learning topics)
- Each step should feel like something a candidate can actually follow

Return ONLY JSON array (no markdown):
[
  {
    "id": "step-1",
    "title": "Clear goal (e.g. Master REST API Design)",
    "description": "Detailed explanation of what to do and why",
    "duration": "1-2 weeks",
    "week": "Week 1",
    "resources": [
      "Official documentation",
      "Specific practice idea",
      "Project suggestion"
    ],
    "priority": "high",
    "tags": ["project"],
    "completed": false
  }
]

Generate 5–7 steps minimum.
Make it structured like a real career improvement plan.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = extractJSON(text);

    // ✅ VALIDATION
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid roadmap from AI");
    }

    return parsed;

  }, [
    // ✅ FALLBACK (ALWAYS WORKS)
    {
      id: "step-1",
      title: "Strengthen Core Backend Fundamentals",
      description: "Review core backend concepts like APIs, databases, and request handling.",
      duration: "1-2 weeks",
      week: "Week 1",
      resources: [
        "Node.js documentation",
        "Build a simple REST API",
        "Practice CRUD operations"
      ],
      priority: "high",
      tags: ["practice"],
      completed: false,
    },
    {
      id: "step-2",
      title: "Build a Real Project",
      description: "Apply your knowledge by building a backend project from scratch.",
      duration: "2-3 weeks",
      week: "Week 2-4",
      resources: [
        "Create a full CRUD app",
        "Use a database like MongoDB",
        "Deploy it online"
      ],
      priority: "high",
      tags: ["project"],
      completed: false,
    },
    {
      id: "step-3",
      title: "Improve Problem Solving",
      description: "Work on coding problems to strengthen logic and thinking.",
      duration: "2 weeks",
      week: "Week 3-5",
      resources: [
        "LeetCode easy-medium problems",
        "Focus on arrays and objects",
        "Practice daily"
      ],
      priority: "medium",
      tags: ["practice"],
      completed: false,
    },
    {
      id: "step-4",
      title: "Learn System Design Basics",
      description: "Understand how scalable systems are designed.",
      duration: "1-2 weeks",
      week: "Week 5-6",
      resources: [
        "System design basics videos",
        "Design a simple URL shortener",
      ],
      priority: "medium",
      tags: ["course"],
      completed: false,
    },
    {
      id: "step-5",
      title: "Enhance Communication Skills",
      description: "Practice explaining technical concepts clearly.",
      duration: "1 week",
      week: "Week 6",
      resources: [
        "Explain your projects out loud",
        "Write short technical summaries",
      ],
      priority: "low",
      tags: ["practice"],
      completed: false,
    }
  ]);
}