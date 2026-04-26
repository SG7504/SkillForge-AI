import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeAI } from "../utils/safeAI.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeATS(resume, jd) {
  return await safeAI(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an ATS (Applicant Tracking System).

Analyze this resume against the job description.

Resume:
${resume}

Job Description:
${jd}

Return JSON:
{
  "score": number (0-100),
  "strengths": ["..."],
  "improvements": ["..."]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }, {
    score: 60,
    strengths: ["Basic skill match"],
    improvements: ["Improve keyword alignment"]
  });
}