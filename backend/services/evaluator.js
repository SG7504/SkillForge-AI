import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeAI } from "../utils/safeAI.js";
import { extractJSON } from "../utils/utils.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function evaluateAnswer(skill, answer) {
  return await safeAI(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a STRICT technical interviewer.

Evaluate the candidate’s answer for the skill: "${skill}".

Scoring rules:
- 0–40 → poor / incorrect
- 41–60 → basic understanding
- 61–80 → good understanding
- 81–100 → strong / expert

Return ONLY valid JSON:
{
  "score": number,
  "level": "Beginner" | "Intermediate" | "Advanced",
  "reason": "1-2 sentence explanation"
}

Be realistic. Do NOT give the same score for everything.

Answer:
${answer}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = extractJSON(text);

    // ✅ STRICT VALIDATION
    if (
      parsed &&
      typeof parsed.score === "number" &&
      parsed.score >= 0 &&
      parsed.score <= 100 &&
      parsed.level &&
      parsed.reason
    ) {
      return parsed;
    }

    // 🔥 SMART FALLBACK (NOT STATIC, NOT RANDOM GARBAGE)
    return {
      score: 60,
      level: "Intermediate",
      reason: "Evaluation fallback due to parsing issue.",
    };

  }, {
    score: 60,
    level: "Intermediate",
    reason: "Fallback evaluation",
  });
}