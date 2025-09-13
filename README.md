# Product Requirements Document: The Autonomous AI Healing Agent ("AHA")

## 1. Overview & Vision

### 1.1. The Vision

To create a "meta-agent" that brings self-healing capabilities to complex, multi-agent AI systems. By observing the operational data of an agentic system in real-time, the Autonomous Healing Agent (AHA) will autonomously detect, diagnose the root cause of, and propose solutions for failures, dramatically reducing debugging time and improving system resilience.

### 1.2. The Problem

Developing and operating sophisticated, multi-agent AI systems is a new frontier fraught with unique challenges. Unlike traditional software, the behavior of these systems is emergent and non-deterministic. When a failure occurs—an agent gets stuck in a loop, misinterprets tool output, or fails to communicate effectively with another agent—diagnosing the issue is a painful, manual process of sifting through logs and traces. There is a critical lack of tooling that can understand the context of a failure and intelligently assist in its resolution.

### 1.3. The Solution

We will build a high-level orchestrator, AHA, that leverages an existing observability platform to monitor a target multi-agent system. When it detects a failure signal (e.g., an error, negative user feedback), it will retrieve the full execution trace, perform a causal analysis using a powerful Large Language Model (LLM), and then take an autonomous action to propose a fix. The results will be logged to a database, presented in a web dashboard, and used to create a GitHub issue.

## 2. Demo Narrative: "The Agent That Got Stuck"

### 2.1. The Story We'll Tell

**Scene:** A developer has deployed a multi-agent research system for their company. The system is supposed to research market trends and generate reports, but it's been failing mysteriously for the past 2 hours.

**The Pain Point:** The developer is staring at a wall of logs, trying to figure out why their `SynthesizerAgent` keeps timing out. They've spent 45 minutes manually tracing through LangSmith logs, but the failure is buried in a complex chain of agent interactions. They're about to miss a critical deadline.

**The Magic Moment:** AHA springs into action! Within 30 seconds of the failure, it:
1. Detects the timeout in the SynthesizerAgent
2. Analyzes the full execution trace
3. Identifies that the ResearcherAgent is returning malformed JSON
4. Creates a GitHub issue with the exact fix needed
5. Updates the dashboard showing the incident and resolution

**The Resolution:** The developer sees the GitHub notification, applies the suggested fix (adding JSON validation), and their system is back online in minutes instead of hours.

### 2.2. Demo Flow

1. **Setup (30 seconds):** Show the multi-agent research system running normally
2. **Inject Failure (15 seconds):** Introduce a bug that causes JSON parsing errors
3. **Show the Problem (30 seconds):** Demonstrate the developer's frustration with manual debugging
4. **AHA Activation (45 seconds):** Show AHA detecting, analyzing, and creating the GitHub issue
5. **Resolution (30 seconds):** Show the fix being applied and system recovery
6. **Dashboard Review (30 seconds):** Show the incident history and insights

## 3. Target Audience

- **AI/ML Engineers & Researchers:** Professionals building, deploying, and maintaining complex agentic systems using frameworks like Zephyr Agents or LangChain.
- **Developers of AI-Powered Applications:** Teams integrating multi-agent workflows into their products who need to ensure reliability and rapid debugging cycles.

## 4. Goals & Objectives

**Primary Goal:** Reduce the Mean Time to Resolution (MTTR) for failures in a complex, multi-agent system.

- **Objective 1 (MVP):** Successfully build a meta-agent (AHA) that can autonomously detect a failure in a separate, monitored agent system.
- **Objective 2 (MVP):** AHA must be able to retrieve the relevant execution trace data from an observability platform via its API.
- **Objective 3 (MVP):** AHA must perform a successful root cause analysis and generate a human-readable diagnosis.
- **Objective 4 (MVP):** AHA must persist the incident and take at least one meaningful, autonomous action (e.g., create a GitHub issue).
- **Objective 5 (MVP):** A web-based UI must display a historical log of all detected incidents.

**Success Metric:** For a set of predefined, injected faults, AHA correctly identifies and creates a valid GitHub issue for >80% of them, and all incidents appear on the dashboard.

## 5. Features & Scope (MVP)

The MVP is composed of two main systems: the Target System to be monitored, and the AHA System that performs the monitoring and healing.

### 5.1. The Target System: "Multi-Agent Research Team"

A complex agentic system that will serve as the "patient" for AHA.

**Functionality:** A system that takes a complex research query and breaks it down for a team of agents to solve.

**Components:**
- **PlannerAgent:** Decomposes the main query into sub-tasks.
- **ResearcherAgent (x2):** Executes sub-tasks by searching the web (using a tool like Tavily).
- **SynthesizerAgent:** Compiles the results from the researchers into a final, coherent report.

**Instrumentation:** The entire system will be instrumented to log all actions to LangSmith.

### 5.2. The Autonomous Healing Agent (AHA) System

The core of the project.

#### Feature 1: Real-Time Failure Detection
- AHA will expose a webhook endpoint to receive notifications from LangSmith.

#### Feature 2: Causal Diagnosis Engine
- Upon receiving a webhook, AHA retrieves the full trace data.
- It uses a powerful LLM to perform a root cause analysis.

#### Feature 3: Autonomous Action & Persistence
- AHA will parse the diagnosis from the LLM.
- It will save the incident details (diagnosis, links, timestamp) to a local database.
- It will use the GitHub API to autonomously create a new issue in a designated repository.

#### Feature 4: Incident Dashboard (UI)
- A clean, web-based interface built in React.
- The dashboard will display a list of all incidents recorded by AHA from the database.
- Each list item will show essential information: a summary of the issue, the time of detection, and direct links to the LangSmith trace and the corresponding GitHub issue.

## 6. Technical Architecture & Stack

- **Programming Language (Backend):** Python 3.11+
- **Core Agent Framework:** Zephyr Agents
  - *Usage:* To build the "Multi-Agent Research Team" (Target System).
- **Observability Platform:** LangSmith
  - *Usage:* To capture traces and trigger webhooks.
- **Diagnosis LLM:** OpenAI GPT-4o or Anthropic Claude 3 Opus
  - *Usage:* The "brain" of the AHA's diagnosis engine.
- **Backend Framework:** FastAPI
  - *Usage:* To create the webhook listener and to serve a REST API for the frontend.
- **Database:** In-memory storage with browser localStorage fallback
  - *Usage:* For demo speed - incidents stored in memory and synced to browser storage.
- **Frontend Framework:** React (with Vite)
  - *Usage:* To build the user-facing Incident Dashboard.
- **UI Styling:** Tailwind CSS
  - *Usage:* For rapid, utility-first styling of the React components.
- **Data Validation (Backend):** Pydantic
  - *Usage:* For robust data validation in API requests/responses.
- **API Integrations:** `langsmith-sdk`, `PyGithub` / `requests`
- **Environment Management:** Poetry (backend), npm/yarn (frontend)

## 7. Configuration Management

### 7.1. Environment Variables (.env)

```bash
# LangSmith Configuration
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_PROJECT=aha-demo
LANGSMITH_WEBHOOK_SECRET=your_webhook_secret

# OpenAI/Claude Configuration
OPENAI_API_KEY=your_openai_api_key
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key

# GitHub Configuration
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=aha-incidents

# AHA Configuration
AHA_WEBHOOK_PORT=8000
AHA_FRONTEND_PORT=3000
AHA_DEBUG_MODE=true
```

### 7.2. Configuration Validation

All configuration will be validated at startup using Pydantic settings, with clear error messages for missing or invalid values.

## 8. Project Scaffolding

The project will be structured as a monorepo to simplify development and management.

```
/autonomous-healing-agent
├── .env                  # Stores all secrets and API keys (NOT committed to git)
├── .gitignore
├── README.md
│
├── backend/                # AHA Python Application (FastAPI)
│   ├── .venv/
│   ├── pyproject.toml      # Poetry dependencies for the backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app entry point, mounts routers
│   │   ├── api/            # API endpoint definitions (routers)
│   │   │   ├── __init__.py
│   │   │   ├── webhooks.py # Endpoint for LangSmith webhook
│   │   │   └── incidents.py# Endpoint for frontend to fetch incidents
│   │   ├── core/           # Core application logic
│   │   │   ├── __init__.py
│   │   │   └── config.py   # Pydantic settings management (loads .env)
│   │   ├── services/       # Business logic (e.g., interacting with external APIs)
│   │   │   ├── __init__.py
│   │   │   ├── diagnosis_service.py # Logic for calling OpenAI/Claude
│   │   │   ├── github_service.py    # Logic for creating GitHub issues
│   │   │   └── langsmith_service.py # Logic for fetching traces
│   │   ├── models/         # Pydantic/SQLModel data models
│   │   │   ├── __init__.py
│   │   │   └── incident.py # Schema for incident data
│   │   └── storage/        # Simple in-memory storage
│   │       ├── __init__.py
│   │       └── memory_store.py # In-memory incident storage
│   └── demo/               # Demo-specific scripts
│       ├── __init__.py
│       ├── inject_failure.py # Script to inject demo failures
│       └── setup_demo.py     # Demo environment setup
│
├── frontend/               # React Incident Dashboard
│   ├── node_modules/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── public/
│   └── src/
│       ├── main.jsx        # App entry point
│       ├── App.jsx         # Main app component and routing
│       ├── components/     # Reusable UI components (e.g., IncidentCard, Layout)
│       ├── pages/          # Top-level page components (e.g., DashboardPage)
│       ├── services/       # Functions for calling the backend API (e.g., api.js)
│       └── assets/         # Static assets like images and CSS
│
└── target_system/          # The Zephyr Agents system to be monitored
    ├── .venv/
    ├── pyproject.toml      # Poetry dependencies for the target system
    ├── run_research_team.py  # Script to run and test the Zephyr agents
    └── demo_scenarios/     # Predefined failure scenarios for demo
        ├── __init__.py
        ├── json_parsing_error.py
        ├── api_timeout.py
        └── agent_loop.py
```

## 9. User & System Flow

1. **Setup:** A developer configures the Target System and AHA with the necessary environment variables (.env).

2. **Execution & Failure:** The Target System runs, and an agent encounters an error.

3. **Detection:** LangSmith captures the error and sends a payload to the AHA webhook endpoint.

4. **Trigger:** AHA's FastAPI server receives the webhook.

5. **Diagnosis:** AHA fetches the full trace, runs the diagnosis with an LLM.

6. **Action:** AHA calls the GitHub API to create a new issue.

7. **Persistence:** AHA saves the complete incident report (diagnosis, trace link, GitHub issue link) to in-memory storage.

8. **Review:** A developer opens the React application in their browser. The UI calls the /api/incidents endpoint on the AHA backend.

9. **Display:** The frontend receives the list of historical incidents and displays them on the dashboard, providing a complete overview of system health and failures.

## 10. Future Work (Post-MVP)

- **Advanced Repair Actions:** Move beyond issue creation to proposing concrete code or prompt changes in a pull request.
- **Interactive Dashboard:** Allow users to "re-run" a diagnosis or add manual notes to an incident directly from the UI.
- **Stateful Analysis:** Enhance the diagnosis engine to analyze an agent's memory and state over time.

## 11. Risks & Mitigation

### Risk: The diagnosis from the LLM may be inaccurate.
**Mitigation:** Heavily engineer the meta-prompt. Include a confidence score and full trace link in the GitHub issue and on the dashboard for easy human verification.

### Risk: Frontend/Backend integration complexity.
**Mitigation:** The monorepo structure and well-defined API schemas (using Pydantic) will reduce integration friction.

### Risk: Security of API keys.
**Mitigation:** Use secure secret management practices via the .env file and Pydantic's settings management. Ensure .env is in .gitignore.

### Risk: Demo reliability and timing.
**Mitigation:** Pre-scripted failure scenarios and thorough testing of the demo flow. Backup plans for API failures during presentation.
