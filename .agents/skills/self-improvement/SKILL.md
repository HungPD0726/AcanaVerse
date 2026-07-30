---
name: self-improvement
description: Teaches the agent to record learned preferences, project-specific corrections, and coding standards, continuously improving performance over time.
---
# Self-Improving Agent Skill

This skill enables the AI agent to continuously record, refine, and enforce project-specific lessons, user preferences, and engineering patterns learned during pair programming sessions.

## 1. Core Principles

- **Capture Corrections**: Whenever the user provides specific feedback, preferences, or corrections, evaluate if this is a general project rule or best practice.
- **Persist Rules**: Record persistent project rules into `AGENTS.md` or dedicated skill documentation so future sessions benefit automatically.
- **Pre-Flight Verification**: Always verify code changes locally (e.g. `npm run build`, `mvn test-compile`, or script execution) before declaring a task complete.

## 2. Learning & Update Workflow

When a new workflow pattern or correction is established:
1. **Validate**: Confirm the pattern against current workspace code and tests.
2. **Document**: Append project-wide rules to `AGENTS.md` or relevant skill files in `.agents/skills/`.
3. **Reflect**: Keep bullet points concise, quantitative, and actionable.

## 3. High-Quality Execution Checklist

Before concluding any major turn or task:
- [ ] Code builds without errors or warnings.
- [ ] Unused or duplicate temporary files are purged.
- [ ] Changes are cleanly committed to Git when requested.
- [ ] User receives a concise, actionable summary of accomplishments.
