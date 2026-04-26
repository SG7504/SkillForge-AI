# 🚀 SkillForge AI

## 📌 Overview

**SkillForge AI** is an AI-powered interview simulation and skill assessment platform designed to help candidates quickly evaluate their readiness for specific roles and improve efficiently.

It supports **multiple experience levels**, from entry-level candidates to professionals with **10+ years of experience**, and dynamically adapts interview questions based on the selected role and expertise level.

---

## ✨ Key Features

### 🎯 Smart AI Interview System

* Role-based and experience-based question generation
* Adaptive questioning tailored to user inputs
* Rapid-fire interview format (6 questions)
* Complete assessment in **5–6 minutes**

---

### 📂 Resume & JD Input

* Drag-and-drop upload support
* PDF parsing for resumes and job descriptions
* Clean and intuitive input experience

---

### 🌙 User Experience

* Lucid dark UI designed for reduced eye strain
* Minimal and distraction-free interface
* Fast and responsive interactions

---

## 📊 Results Dashboard

After completing the interview, users receive a **comprehensive multi-category report**:

### ✅ Overview

* Skill Match Percentage
* Strongest Skill Identification
* Weakest Skill Identification
* Personalized AI Feedback

---

### 🧠 Skills Analysis

* Detailed breakdown of skills
* Strength vs Weakness categorization
* **Rating system (1–10 scale)** for each skill
* Clear identification of areas needing improvement

---

### 📄 ATS Score

* ATS compatibility score **(out of 100)**
* Keyword-based resume analysis
* Highlights:

  * Strong points in resume
  * Weak areas to improve
* Actionable suggestions to optimize resume

---

### 🗺️ Personalized Learning Roadmap

* Customized learning plan based on performance

* Week-by-week structured roadmap

* Includes:

  * 📚 Courses
  * 💻 Projects
  * 📝 Practice tasks

* Priority-based learning:

  * High / Medium / Low focus areas

---

### 🔁 Continuous Improvement

* Learning path adapts based on user progress
* Users can **retake assessments multiple times**
* Helps identify new skill gaps over time

---

## 🛠️ Tech Stack

**Frontend:**

* React
* JavaScript
* TypeScript
* Tailwind CSS

**Backend:**

* Node.js
* Express

**AI Integration:**

* Google Gemini Pro API

---

## ⚙️ Project Structure

The project is built with a **separated frontend and backend architecture** for better modularity and understanding.

```
Frontend → React (UI + Dashboard)
Backend  → Node.js (API + AI processing)
```

---
## 🏗️ Detailed Project Architecture

SkillForge AI follows a **modular full-stack architecture** with a clear separation between frontend and backend systems.

---

## 📁 Project Structure

```text
skillforge-ai/
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ResultsDashboard.tsx
│       │   ├── LearningRoadmap.tsx
│       │   ├── RoadmapStep.tsx
│       │   ├── SkillBar.tsx
│       │   ├── ChatInterface.tsx
│       │   ├── InputPanel.tsx
│       │   └── ...
│       │
│       ├── types/
│       │   └── index.ts
│       │
│       ├── lib/
│       │   └── api.ts
│       │
│       ├── App.tsx
│       └── main.tsx
│
├── backend/
│   ├── controllers/
│   │   └── chatController.js
│   │
│   ├── services/
│   │   ├── evaluator.js
│   │   ├── planner.js
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── safeAI.js
│   │   ├── utils.js
│   │   └── ...
│   │
│   ├── routes/
│   │   └── chatRoutes.js
│   │
│   ├── server.js
│   └── .env
│
└── README.md
```

---

## 🖥️ Frontend Architecture (React + TypeScript)

### 🔹 Core Responsibility

Handles **UI rendering, user interaction, and API communication**

---

### 🔹 Key Files

#### `App.tsx`

* Central state manager
* Controls application flow:

  * Input → Interview → Results → Roadmap
* Handles API calls and stores:

  * `result`
  * `roadmap`

---

#### `components/`

| Component              | Responsibility                                    |
| ---------------------- | ------------------------------------------------- |
| `ResultsDashboard.tsx` | Displays analysis results (skills, ATS, feedback) |
| `LearningRoadmap.tsx`  | Displays full learning plan                       |
| `RoadmapStep.tsx`      | Individual roadmap step rendering                 |
| `SkillBar.tsx`         | Skill visualization (score + confidence)          |
| `ChatInterface.tsx`    | AI interview chat UI                              |
| `InputPanel.tsx`       | Resume + JD input                                 |

---

#### `lib/api.ts`

* Handles all frontend → backend API calls:

  * `startInterview()`
  * `sendMessage()`
  * `analyzeResponses()`
  * `generateRoadmap()`

---

#### `types/`

* TypeScript interfaces for:

  * `AssessmentResult`
  * `RoadmapStep`
  * `SkillScore`

---

## ⚙️ Backend Architecture (Node.js + Express)

### 🔹 Core Responsibility

Handles **business logic, AI communication, and response processing**

---

### 🔹 Key Files

#### `server.js`

* Entry point of backend
* Sets up Express server
* Registers routes

---

#### `routes/chatRoutes.js`

* Defines API endpoints:

  * `/start`
  * `/chat`
  * `/analyze`
  * `/roadmap`

---

#### `controllers/chatController.js`

* Acts as **request handler layer**
* Receives requests from frontend
* Calls appropriate services
* Sends structured responses back

---

### 🔹 Services Layer

#### `services/evaluator.js`

* Evaluates user answers
* Assigns:

  * Score (0–100)
  * Level (Beginner → Advanced)
  * Reasoning

---

#### `services/planner.js`

* Generates learning roadmap
* Returns structured steps:

  * Title
  * Description
  * Resources
  * Priority

---

### 🔹 Utilities

#### `utils/safeAI.js`

* Wraps AI calls with:

  * Error handling
  * Fallback responses

---

#### `utils/utils.js`

* Helper functions:

  * JSON extraction
  * Data cleaning

---

## 🔄 Data Flow

```text
User Input (Resume + JD)
        │
        ▼
Frontend (React)
        │
        ▼
API Calls (api.ts)
        │
        ▼
Backend (Express)
        │
        ▼
Controller (chatController.js)
        │
        ▼
Services (evaluator / planner)
        │
        ▼
AI (Gemini API)
        │
        ▼
Processed Response
        │
        ▼
Frontend Dashboard + Roadmap
```

---

## 🧠 Architecture Highlights

* Clear **separation of concerns**
* Scalable service-based backend
* Reusable React components
* Type-safe frontend (TypeScript)
* AI abstraction layer via services

---


---

### 🔹 Component Breakdown

#### 🖥️ Frontend

* Built using React + TypeScript
* Handles:

  * User input (resume, job description)
  * Interview chat interface
  * Results dashboard
  * Learning roadmap UI

---

#### ⚙️ Backend

* Built using Node.js + Express
* Handles:

  * Interview flow logic
  * AI request handling
  * Response processing
  * Roadmap generation

---

#### 🧠 AI Layer

* Powered by Google Gemini Pro API
* Responsible for:

  * Generating interview questions
  * Evaluating answers
  * Producing feedback
  * Creating learning plans

---

### 🔹 Data Flow

```text
1. User submits resume + job description
2. Frontend sends data → Backend
3. Backend sends prompt → Gemini API
4. AI returns response → Backend
5. Backend processes → sends to Frontend
6. Frontend displays results & roadmap
```

---

### 🔹 Design Principles

* Separation of concerns (Frontend vs Backend)
* Modular and scalable structure
* API-driven communication
* Easily extendable for future features

---


## ⚙️ How to Run Locally

### 🔹 1. Frontend

```bash id="front_run"
npm install
npm run dev
```

---

### 🔹 2. Backend

Navigate to backend folder:

```bash id="backend_nav"
cd backend
```

Run server:

```bash id="backend_run"
node server.js
```

---

## ⚠️ Prototype Notice

This project is currently a **prototype**.

Due to limitations with API key availability, some AI functionalities may use fallback/mock data during testing.

However, the system is designed for full integration with **Google Gemini Pro API** and is intended to be scalable for production use.

---

## 🧪 Sample Inputs & Outputs

---

## 🔹 1. Entry-Level Frontend Developer (0–2 Years)

### Input

```text
Role: Frontend Developer
Experience: 0–2 years

Resume:
- Built responsive UI using React
- Basic JavaScript and CSS knowledge
- Created small personal projects

Job Description:
Looking for a frontend developer skilled in React, UI development, and API integration.
```

### Output

```json
{
  "overallScore": 65,
  "strongestSkill": "UI Development",
  "weakestSkill": "API Integration",
  "aiFeedback": "Strong UI fundamentals but lacks experience in handling APIs and real-world projects."
}
```

```json
{
  "skills": [
    { "name": "React", "score": 70, "category": "strength" },
    { "name": "JavaScript", "score": 65, "category": "strength" },
    { "name": "API Integration", "score": 50, "category": "weakness" }
  ]
}
```

```json
{
  "atsScore": 68,
  "suggestions": [
    "Add API-based projects",
    "Include measurable achievements",
    "Highlight problem-solving examples"
  ]
}
```

---

## 🔹 2. Mid-Level Backend Developer (3–5 Years)

### Input

```text
Role: Backend Developer
Experience: 3–5 years

Resume:
- Experience with Node.js and Express
- Built REST APIs
- Worked with MongoDB

Job Description:
Seeking backend developer with strong API design, database optimization, and scalability experience.
```

### Output

```json
{
  "overallScore": 74,
  "strongestSkill": "API Development",
  "weakestSkill": "System Design",
  "aiFeedback": "Solid backend experience, but needs improvement in designing scalable systems."
}
```

```json
{
  "skills": [
    { "name": "Node.js", "score": 80, "category": "strength" },
    { "name": "Databases", "score": 72, "category": "strength" },
    { "name": "System Design", "score": 60, "category": "weakness" }
  ]
}
```

```json
{
  "atsScore": 75,
  "suggestions": [
    "Add system design experience",
    "Include performance optimization metrics",
    "Mention scalability projects"
  ]
}
```

---

## 🔹 3. Senior DevOps Engineer (5–8 Years)

### Input

```text
Role: DevOps Engineer
Experience: 5–8 years

Resume:
- Experience with AWS, Docker, CI/CD pipelines
- Managed deployments and infrastructure
- Familiar with Kubernetes

Job Description:
Looking for DevOps engineer with strong cloud architecture, automation, and monitoring experience.
```

### Output

```json
{
  "overallScore": 82,
  "strongestSkill": "CI/CD Automation",
  "weakestSkill": "Monitoring & Observability",
  "aiFeedback": "Strong DevOps foundation, but monitoring and observability practices can be improved."
}
```

```json
{
  "skills": [
    { "name": "AWS", "score": 85, "category": "strength" },
    { "name": "Docker/Kubernetes", "score": 80, "category": "strength" },
    { "name": "Monitoring", "score": 65, "category": "weakness" }
  ]
}
```

```json
{
  "atsScore": 80,
  "suggestions": [
    "Highlight monitoring tools (Prometheus, Grafana)",
    "Include incident response experience",
    "Add metrics-driven achievements"
  ]
}
```

---

## 🔹 4. Lead QA Engineer (8–10+ Years)

### Input

```text
Role: QA Engineer (Lead)
Experience: 8–10+ years

Resume:
- Led QA teams
- Experience with automation testing (Selenium)
- Worked on large-scale enterprise applications

Job Description:
Looking for QA Lead with expertise in automation frameworks, team leadership, and testing strategies.
```

### Output

```json
{
  "overallScore": 78,
  "strongestSkill": "Test Automation",
  "weakestSkill": "Strategic Test Planning",
  "aiFeedback": "Strong leadership and automation skills, but strategic planning and test architecture can be improved."
}
```

```json
{
  "skills": [
    { "name": "Automation Testing", "score": 85, "category": "strength" },
    { "name": "Team Leadership", "score": 80, "category": "strength" },
    { "name": "Test Strategy", "score": 65, "category": "weakness" }
  ]
}
```

```json
{
  "atsScore": 77,
  "suggestions": [
    "Highlight leadership impact",
    "Include test strategy contributions",
    "Mention cross-team collaboration"
  ]
}
```

---

### 🔹 Notes

* Outputs are dynamically generated using AI (Gemini API)
* Prototype may use fallback/mock data
* Results vary based on user input and performance

---


## 🎥 Demo Video

👉 [Add your demo video link here]

---

## 🌐 Live Demo

👉 https://skill-forge-gigizxomc-sg7504s-projects.vercel.app/

---

## 📦 Repository

👉 https://github.com/SG7504/SkillForge-AI

---

## 👤 Author

* Name: Sparsh Guha
* GitHub: SG7504

---

## 🚀 Future Scope

* Fully functional AI integration with stable API keys
* Real-time adaptive learning paths
* User progress tracking and analytics
* Scalable deployment for large user base

---

## 💡 Summary

SkillForge AI focuses on **fast, accurate, and actionable skill assessment**, helping users identify gaps and improve efficiently through structured guidance and AI-driven insights.
