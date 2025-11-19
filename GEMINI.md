# Project Context: deep-agents-server

## Overview
`deep-agents-server` is a web application built with **Next.js 16** and **React 19**, utilizing **TypeScript** for type safety and **Tailwind CSS v4** for styling. It follows the modern App Router architecture.

## Tech Stack
- **Framework:** Next.js 16.0.3 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (configured via `@import "tailwindcss";` in `globals.css`)
- **Linting:** ESLint 9

## Key Commands
Run these commands from the project root:

- **Development Server:**
  ```bash
  npm run dev
  ```
  Starts the app at `http://localhost:3000`.

- **Build for Production:**
  ```bash
  npm run build
  ```
  Builds the application for production usage.

- **Start Production Server:**
  ```bash
  npm run start
  ```
  Runs the built application.

- **Lint Code:**
  ```bash
  npm run lint
  ```
  Runs ESLint to check for code quality issues.

## Project Structure
- `src/app/`: Contains the application source code (App Router).
    - `layout.tsx`: Root layout definition.
    - `page.tsx`: Main entry page.
    - `globals.css`: Global styles and Tailwind imports.
- `public/`: Static assets (images, svgs).
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript configuration.
- `eslint.config.mjs`: ESLint configuration.
- `postcss.config.mjs`: PostCSS configuration.

## Development Conventions
- **Styling:** Use Tailwind CSS utility classes. Custom theme variables are defined in `src/app/globals.css`.
- **Component Structure:** Follow the App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.).
- **Type Safety:** strict TypeScript usage is encouraged.
