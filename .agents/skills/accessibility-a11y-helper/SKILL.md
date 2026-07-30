---
name: accessibility-a11y-helper
description: Best practices for WCAG compliance, ARIA accessibility, keyboard navigation, and automated accessibility testing with Playwright Axe.
---
# Web Accessibility (a11y) Developer Helper Skill

Use this skill when building interactive UI controls, card flip animations, drag-and-drop slots, or running accessibility test suites.

## 1. Interactive Control Guidelines
- **Buttons vs. Divs**: Interactive elements (like card slots or fan cards) must be semantic `<button>` elements or have `role="button"` with `tabIndex={0}`.
- **Accessible Names**: All cards must have descriptive `aria-label` attributes indicating card position order, position label, and reveal state (e.g. `01. Quá khứ: Chạm để lật`).
- **Live Regions**: Dynamic progress updates (e.g. "Đã chọn 2 trên 3 lá") should be wrapped in `<div className="sr-only" aria-live="polite">`.

## 2. Reduced Motion Support
- Always respect `prefers-reduced-motion: reduce` media query.
- Use `MotionConfig` from `motion/react` or CSS `@media (prefers-reduced-motion: reduce)` to disable heavy 3D flips and card sweeps for users with vestibular sensitivities.

## 3. Automated Accessibility Checks
- Run E2E accessibility audits with `@axe-core/playwright`:
  ```powershell
  npm run test:e2e
  ```
- Ensure zero WCAG 2.1 AA violations on color contrast, focus rings (`focus-visible:outline-accent`), and landmark roles.
