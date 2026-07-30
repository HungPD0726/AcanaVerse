---
name: ai-structured-output-helper
description: Guidelines for integrating LLMs (Gemini / OpenAI) with strict JSON Schema structured outputs for Tarot interpretations.
---
# AI Structured Output Helper Skill

Use this skill when designing LLM prompts, AI interpretation pipelines, or backend API route handlers that process Tarot card readings.

## 1. Core Principles
- **Separation of Concerns**: The AI **must ONLY interpret** cards that were drawn randomly by the client domain engine (`src/domain/tarot.ts`). The AI **must NEVER** decide, alter, or pick which cards are drawn.
- **Strict Structured Outputs**: Always enforce LLM JSON Schema structured outputs (e.g. OpenAI `response_format: { type: "json_schema" }` or Gemini `responseSchema`). Never parse unstructured free-form markdown text.

## 2. Standard JSON Schema Structure
```json
{
  "title": "TarotReadingInterpretation",
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "keyThemes": { "type": "array", "items": { "type": "string" } },
    "cardAnalysis": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "positionOrder": { "type": "integer" },
          "cardName": { "type": "string" },
          "orientation": { "type": "string", "enum": ["upright", "reversed"] },
          "insight": { "type": "string" },
          "reflectionQuestion": { "type": "string" }
        },
        "required": ["positionOrder", "cardName", "orientation", "insight", "reflectionQuestion"]
      }
    },
    "advice": { "type": "string" }
  },
  "required": ["summary", "keyThemes", "cardAnalysis", "advice"]
}
```

## 3. Best Practices
- **Bilingual Context**: Pass the user's selected `locale` ("vi" or "en") in the prompt context so the AI responds in the matching language.
- **Graceful Fallbacks**: Always handle API rate limits, timeouts, or network failures with user-friendly retry states or pre-built static seed interpretations from `src/data/card-seeds.ts`.
