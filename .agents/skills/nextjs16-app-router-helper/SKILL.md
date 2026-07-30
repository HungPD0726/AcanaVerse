---
name: nextjs16-app-router-helper
description: Best practices, performance optimization, and architectural guidelines for Next.js 16 App Router applications.
---
# Next.js 16 App Router Developer Helper Skill

Use this skill when designing, building, or refactoring routes, components, server/client boundaries, and performance logic for Next.js 16.

## 1. Core Architecture Guidelines
- **App Router Conventions**: Structure pages under `src/app/[locale]/` with `layout.tsx`, `page.tsx`, `not-found.tsx`, and route handlers inside `route.ts`.
- **Server vs. Client Components**:
  - Default to **Server Components** for data fetching, static layout rendering, and metadata.
  - Use `'use client'` strictly when handling interactive state (`useState`, `useReducer`), browser events (`onClick`, `onDragStart`), Framer Motion animations (`motion.div`), or React Hooks.
- **Local Documentation**: Prioritize bundled Next.js 16 documentation inside `node_modules/next/dist/docs/` for version-specific API behavior.

## 2. Performance & Media Optimization
- **Image Optimization**: Always use `next/image` with explicit `sizes`, `fill` or `width`/`height` props and `object-cover`/`object-contain` for WebP assets under `public/images/`.
- **Font Optimization**: Use `next/font/google` for modern typography (e.g. Be Vietnam Pro, Newsreader).
- **Streaming & Suspense**: Wrap heavy dynamic components in React `Suspense` boundaries with skeletal fallback loaders.

## 3. Pre-Flight Checklist
- [ ] No unnecessary `'use client'` directives on static layout components.
- [ ] All `next/image` instances have descriptive `alt` tags and proper `sizes`.
- [ ] Route parameters like `[locale]` are correctly typechecked with TypeScript interfaces.
