import { extractSkills } from "../services/skillExtractor.js";
import { generateQuestions } from "../services/questionGenerator.js";
import { evaluateAnswer } from "../services/evaluator.js";
import { generatePlan } from "../services/planner.js";
import { analyzeATS } from "../services/atsAnalyzer.js";

let sessions = {};

// ⏱️ Timeout wrapper
const withTimeout = (promise, ms = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI Timeout")), ms)
    ),
  ]);
};

export const handleChat = async (req, res) => {
  const { jd, resume, answer, sessionId: bodySessionId } = req.body;

  // ✅ FIXED SESSION HANDLING
  const sessionId = bodySessionId || req.ip;

  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      started: false,
      skills: [],
      questions: [],
      answers: [],
      current: 0,
      ats: null,
    };
  }

  const session = sessions[sessionId];

  try {
    // 🚀 START INTERVIEW
    if (!session.started) {
      if (!jd || !resume) {
        return res.json({
          step: "input",
          message: "Provide JD and Resume",
        });
      }

      // 🔥 Extract skills + ATS
      const skillsData = await withTimeout(extractSkills(jd, resume));
      const atsResult = await withTimeout(analyzeATS(resume, jd));

      session.ats = atsResult || {
        score: 0,
        strengths: [],
        improvements: [],
      };

      // ✅ Clean skill handling
      const extractedSkills = skillsData?.required_skills || [];

      const defaultSkills = [
        "Problem Solving",
        "Communication",
        "Backend Development",
        "APIs",
        "Databases",
      ];

      session.skills = [...new Set([...extractedSkills, ...defaultSkills])];

      if (!session.skills.length) {
        return res.json({
          step: "error",
          message: "No skills found",
        });
      }

      // ✅ Generate questions ONCE
      session.questions = await withTimeout(
        generateQuestions(session.skills)
      );

      // ✅ Fallback if AI fails
      if (!session.questions || session.questions.length === 0) {
        session.questions = [
          "Tell me about your technical background.",
          "Explain a project you have worked on.",
          "What are your strengths in backend development?",
          "How do you approach problem-solving?",
          "Explain APIs and how you have used them.",
          "What databases are you familiar with?",
        ];
      }

      // Limit to max 6
      session.questions = session.questions.slice(0, 6);

      session.started = true;

      return res.json({
        step: "question",
        message: session.questions[0],
      });
    }

    // 🚀 HANDLE ANSWERS
    if (answer) {
      if (!session.skills[session.current]) {
        delete sessions[sessionId];
        return res.json({
          step: "error",
          message: "Session expired",
        });
      }

      console.log("EVALUATING:", session.skills[session.current]);
      console.log("ANSWER:", answer);

      let evalResult;

      try {
        evalResult = await withTimeout(
          evaluateAnswer(session.skills[session.current], answer)
        );
        console.log("AI RESULT:", evalResult);
      } catch (err) {
        console.error("EVALUATION ERROR:", err);
        evalResult = null;
      }

      session.answers.push({
        skill: session.skills[session.current],
        score: evalResult?.score ?? 50,
        level: evalResult?.level ?? "Beginner",
        reason: evalResult?.reason ?? "AI evaluation unavailable",
      });

      session.current++;

      // 👉 NEXT QUESTION
      if (session.current < session.questions.length) {
        return res.json({
          step: "question",
          message: session.questions[session.current],
        });
      }

      // 🎯 FINAL OUTPUT
      let roadmap;

      try {
        roadmap = await withTimeout(generatePlan(session.answers), 12000);
      } catch (err) {
        console.error("ROADMAP ERROR:", err);
        roadmap = [
          {
            title: "Improve Core Concepts",
            description:
              "Focus on strengthening weak areas identified in the interview.",
            duration: "2-3 weeks",
          },
        ];
      }

const skills = session.answers.map((a) => ({
  name: a.skill,
  score: a.score,
  category:
    a.score >= 70 ? "strength" :
    a.score >= 50 ? "neutral" : "weakness",
  confidence: "medium",
}));

const strengths = skills
  .filter((s) => s.category === "strength")
  .map((s) => s.name);

const weaknesses = skills
  .filter((s) => s.category === "weakness")
  .map((s) => s.name);

const overallScore =
  Math.round(
    skills.reduce((sum, s) => sum + s.score, 0) / skills.length
  ) || 0;

const finalResponse = {
  step: "result",
  overallScore,
  atsScore: session.ats?.score || 0,
  skills,
  strengths,
  weaknesses,
  aiFeedback: "Based on your responses, focus on improving weaker areas.",
  strongestSkill: strengths[0] || skills[0]?.name || "",
  weakestSkill: weaknesses[0] || skills[skills.length - 1]?.name || "",
  roadmap,
  ats: session.ats,
};

      delete sessions[sessionId];

      return res.json(finalResponse);
    }

    return res.json({
      step: "error",
      message: "Invalid request",
    });
  } catch (err) {
    console.error("FATAL ERROR:", err);

    delete sessions[sessionId];

    return res.json({
      step: "error",
      message: "Something went wrong. Please restart.",
    });
  }
};