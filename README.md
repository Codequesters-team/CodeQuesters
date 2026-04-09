# Neuro Chain - AI Execution Visualizer

**Neuro Chain** is an advanced AI Execution Visualizer application that leverages multiple state-of-the-art AI models to process prompts through a rigorous, multi-stage analytical pipeline. Built as a standalone Single Page Application using React and Vite, the platform orchestrates a sequence of cognitive steps—from initial context enrichment utilizing Gemini Flash models, through rigorous validation using GPT-class models, finishing with a multi-perspective synthesis—all completely visualized for the user.

## Overview

The application takes a single user prompt and orchestrates an 8-stage intelligent pipeline:

1. **Input Analysis** (`gemini-2.5-flash`): Identifies intent, key topics, and complexity.
2. **Context Enrichment** (`gemini-2.5-flash-lite`): Expands the query with related concepts and semantic connections.
3. **Output Generation** (`gemini-3-flash-preview`): Generates a comprehensive, primary response.
4. **Multi-Perspective Generation** (`gemini-3-flash-preview`): Evaluates the prompt from Technical, Educational, Creative, Business, and Scientific viewpoints simultaneously.
5. **Quality & Completeness Analysis** (`gemini-2.5-pro`): Cross-evaluates the pipeline for accuracy, coherence, and biases.
6. **Validation & Confidence Scoring** (`gpt-5-mini`): Conducts hallucination probability and factual risk assessment.
7. **Advanced Reasoning & Synthesis** (`gpt-5`): Synthesizes all perspectives into a unified, coherent breakdown.
8. **Final Review & Risk Assessment** (`gemini-3.1-pro-preview`): Performs a concluding quality gate check, providing confidence scores and an approval status.

Through the power of the **Pollinations AI** API endpoint, Neuro Chain seamlessly mimics large-scale cloud chaining with zero-configuration required. 

## Project Structure

The project has been separated into `frontend` and `backend` directories for organized full-stack growth.

```text
/ (Project Root)
├── backend/
│   └── supabase/          # Database configuration (Supabase)
├── frontend/
│   ├── src/               # React Source Assets, Components, UI
│   ├── public/            # Vite Public Assets
│   ├── index.html         # SPA Entry point
│   ├── package.json       # App Dependencies
│   └── vite.config.ts     # Vite Config
├── .gitignore
└── README.md
```

## Features

- **Multi-Perspective Rendering**: Simultaneously visualizes answers across Technical, Educational, Creative, Business, and Scientific lenses.
- **Pipeline Stage Monitoring**: Real-time rendering of confidence scores, token usage, execution durations (ms), and risk levels for every generated thought.
- **Dynamic Risk Assessment**: Integrated systemic guardrails blocking potentially harmful or explicitly flagged topic patterns. 
- **Offline / Bounded Fallbacks**: Built-in mock modes guaranteeing output formats if API connectivity drops.
- **Modern UI/UX**: Built entirely on top of Radix UI primitives and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (Version 18+ Recommended)
- npm, yarn, or bun (We use `npm` by default, but a `bun.lock` is included)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Web Application Locally

1. Ensure you are in the `frontend/` folder.
2. (Optional) Provide your API key. Create a `.env` file in the `frontend` root:
   ```env
   VITE_POLLINATIONS_API_KEY=your_api_key_here
   ```
   *Note: Pollinations.ai has a generous public pool, so adding a Bearer token may not strictly be required.*
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application running locally at `http://localhost:5173`. 

## Built With

- **React & Vite**: Core SPA templating & build tooling.
- **Tailwind CSS**: Utility-first styling architecture.
- **Radix UI & Shadcn**: Unstyled, accessible component primitives.
- **Pollinations AI API**: Providing access to advanced GPT-5 and Gemini-3 proxies. 
- **Supabase**: Data persistence environment configured in `backend/`.

## Legal / Disclaimers
This system performs automated calls to third-party endpoints. Responses generated inside the UI are strictly the property of their respective AI model pipelines (Google Gemini, OpenAI GPT) and may suffer from hallucinations or inaccuracies. Use discretion on output. 
