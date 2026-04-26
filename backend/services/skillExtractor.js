import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractJSON } from "./utils.js";
import { safeAI } from "../utils/safeAI.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractSkills = async (jd, resume) => {
  return await safeAI(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Extract key skills.

Return ONLY JSON:
{
  "required_skills": ["..."],
  "candidate_skills": ["..."]
}

Job Description:
${jd}

Resume:
${resume}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = extractJSON(text);

    return {
      required_skills: parsed?.required_skills || [],
      candidate_skills: parsed?.candidate_skills || [],
    };
  }, {
    required_skills: ["JavaScript", "Communication"],
    candidate_skills: ["Basic Programming"]
  });
};