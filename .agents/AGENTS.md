# ArcanaVerse Workspace Rules

These guidelines define standard practices, coding styles, and workflow restrictions for the ArcanaVerse workspace.

## Project Overview
ArcanaVerse is a bilingual (Vietnamese/English) Tarot reading web application built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion, and `next-intl`.

## Coding Style & Standards

### Frontend (Next.js & React)
- **Framework & Structure**: Use Next.js 16 App Router conventions with TypeScript.
- **Components**: Functional components with standard React Hooks.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) and Motion (`motion`) for smooth animations and micro-interactions. Keep UI designs rich, dark, mystical, elegant, and responsive.
- **Internationalization**: Use `next-intl` for all user-facing strings (supporting `/vi` and `/en` routes).
- **Tarot Assets**: The 78 Rider-Waite-Smith card scans live in `public/images/cards/` as WebP files. Brand graphics live in `public/images/brand/`.

## Quality Assurance & Verification
Before declaring a feature or fix complete, ensure all standard check scripts pass without errors:
- Linting: `npm run lint`
- Type Checking: `npm run typecheck`
- Unit Testing: `npm test` (Vitest)
- End-to-End Testing: `npm run test:e2e` (Playwright)
- Production Build: `npm run build`
