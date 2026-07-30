---
name: postgres-prisma-helper
description: Guidelines for designing PostgreSQL schemas, Prisma ORM migrations, and Row-Level Security (RLS) for Tarot web apps.
---
# PostgreSQL & Prisma ORM Developer Helper Skill

Use this skill when designing backend schemas, Prisma models, database migrations, or security policies for ArcanaVerse.

## 1. Schema Design Standards
- **Primary Keys**: Prefer `UUID` (`@default(uuid())`) or `@default(dbgenerated("gen_random_uuid()"))` for security and offline generation.
- **Timestamps**: Always include `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`.
- **JSONB for Dynamic Data**: Use `@db.JsonB` for multilingual text objects (`{ vi: "...", en: "..." }`) and drawn card arrays.

## 2. Recommended Core Models
- `User`: Accounts, auth provider IDs, locale preferences, subscription status.
- `TarotDeck`: Deck metadata, cover images, price tier.
- `SpreadDefinition`: Positions, prompt hints, layout coordinates.
- `ReadingSession`: User relationship, question, drawn cards JSON, completion timestamp.

## 3. Database Security & Migrations
- **Row-Level Security (RLS)**: Enforce RLS policies so regular users can strictly read/write only their own reading sessions (`user_id = auth.uid()`).
- **Reproducible Migrations**: All schema modifications must be versioned in migration SQL files that run cleanly on a fresh PostgreSQL instance.
