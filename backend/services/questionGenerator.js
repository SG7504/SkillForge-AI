import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractJSON } from "./utils.js";
import { safeAI } from "../utils/safeAI.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuestions = async (skills) => {
  return await safeAI(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Generate one interview question for each skill.

Skills:
${skills.join(", ")}

Return ONLY JSON array:
["question1", "question2", "question3"]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = extractJSON(text);

    if (Array.isArray(parsed)) return parsed;

    return [];
  },
  // 🔥 fallback (VERY IMPORTANT)
  skills.map(skill => `Explain your experience with ${skill}`));
};