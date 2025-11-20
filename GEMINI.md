# Project Context: deep-agents-server

## Overview
`deep-agents-server` is the backend runtime for "Deep Agents", a system designed to host advanced AI agents capable of planning, execution, and delegation. It acts as the server-side component that manages agent threads, executes LangGraph-based workflows, and interfaces with external APIs (LLMs, Search).

The application is built with **Next.js 16** (App Router) and exposes a RESTful API with streaming capabilities (Server-Sent Events) for real-time agent interaction.

## Tech Stack
- **Framework:** Next.js 16.0.3 (App Router)
- **Language:** TypeScript
- **Agent Framework:**
  - **LangGraph:** For stateful, multi-actor agent orchestration (`@langchain/langgraph`).
  - **LangChain:** For tool interfaces and model abstractions (`@langchain/core`).
  - **DeepAgents:** Custom agent wrapper (`deepagents`).
- **AI Models:** Google Gemini 3 Pro Preview (via `@langchain/google-genai`).
- **Search Tools:**
  - **WebSearchAPI:** For general web queries (`web_search`).
  - **Exa:** For semantic/neural search (`exa_search`).
- **Persistence:** In-memory checkpointing (`MemorySaver`).
- **Styling:** Tailwind CSS v4.
- **Linting:** ESLint 9.

## Core Architecture

### 1. Agent Runtime (`src/agent/graph.ts`)
The core agent is defined using **LangGraph**. It is configured as a "Deep Agent" that:
- **Plans:** Uses `write_todos` (conceptually) to break down tasks.
- **Executes:** Uses `web_search` and `exa_search` tools.
- **Delegates:** Can offload sub-tasks.
- **Persists:** Uses `MemorySaver` to maintain state across turns in a thread.

### 2. API Endpoints (`src/app/api/`)
The server exposes the following endpoints:

- **`POST /api/threads`**
  - Creates a new conversation thread.
  - **Response:** `{ "thread_id": "uuid..." }`

- **`POST /api/threads/[threadId]/runs/stream`**
  - The main interaction endpoint. Accepts messages or commands and streams the agent's execution events.
  - **Input:** `{ input: { messages: [...] }, command: { ... }, config: { ... } }`
  - **Output:** Server-Sent Events (SSE) stream containing `data`, `messages`, `updates`, etc.

- **`POST /api/threads/[threadId]/state`**
  - Updates the state of a thread (currently a shim implementation that merges values without persistence in `MemorySaver`).
  - **Input:** `{ values: { ... } }`
  - **Output:** `{ values: { ... }, thread_id: "..." }`

## Key Commands

- **Development Server:**
  ```bash
  npm run dev
  ```
  Starts the app at `http://localhost:3000`.

- **Build for Production:**
  ```bash
  npm run build
  ```

- **Start Production Server:**
  ```bash
  npm run start
  ```

- **Lint Code:**
  ```bash
  npm run lint
  ```

## Project Structure
- `src/agent/`
    - `graph.ts`: Defines the LangGraph agent, tools (WebSearch, Exa), and system prompt.
- `src/app/`
    - `api/`: API route handlers.
        - `threads/`: Thread management and run streaming.
        - `search/`: Search utility.
    - `layout.tsx`: Root layout.
    - `page.tsx`: Main entry page (likely a landing or status page).
    - `globals.css`: Global styles.
- `public/`: Static assets.
- `next.config.ts`: Next.js configuration.

## Environment Variables
The application relies on several key API keys (ensure these are set in `.env.local` or the environment):
- `GOOGLE_API_KEY`: For Gemini models.
- `WEBSEARCHAPI_KEY`: For general web search.
- `EXA_API_KEY`: For Exa semantic search.