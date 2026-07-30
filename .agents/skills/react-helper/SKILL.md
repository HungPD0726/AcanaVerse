---
name: react-helper
description: Guidelines and helper instructions to build, run, test and debug the ArcanaVerse Next.js & React frontend application.
---
# ArcanaVerse Next.js & React Developer Helper Skill

Use this skill when working on the ArcanaVerse frontend web application.

## Environment & Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19 & TypeScript.
- **Styling**: Tailwind CSS v4 + Motion (`motion`).
- **Internationalization**: `next-intl` (Vietnamese `/vi`, English `/en`).
- **Testing**: Vitest (Unit/Component), Playwright (E2E testing), ESLint.

## Development & Test Commands
Always execute these commands from the repository root directory (`d:\hungProject\ArcanaVerse`):

1. **Install Dependencies**:
   ```powershell
   npm install
   ```
2. **Run Dev Server**:
   ```powershell
   npm run dev
   ```
   *(Access at `http://localhost:3000`)*

3. **Code Verification Workflow**:
   ```powershell
   npm run lint
   npm run typecheck
   npm test
   npm run test:e2e
   npm run build
   ```

## Best Practices
- **Bilingual Support**: All visible text should support i18n via `next-intl` dictionaries in `messages/`.
- **Animations & Mystical Theme**: Maintain a dark, polished, high-end mystical aesthetic using Motion and Tailwind v4.
- **Card Assets**: Access tarot cards from `public/images/cards/` using WebP format.
- **Error Handling & State**: Ensure interactive tarot reading flows handle edge cases gracefully and support keyboard navigation and accessibility.
