---
name: i18n-next-intl-helper
description: Guidelines and verification workflows for bilingual (Vietnamese/English) internationalization using next-intl.
---
# Internationalization (i18n) Helper Skill

Use this skill when adding new UI features, text strings, spread definitions, or card interpretation content to ArcanaVerse.

## 1. Dictionary Structure & Conventions
- All translations live under `messages/vi.json` (Vietnamese) and `messages/en.json` (English).
- Keep keys grouped logically by section (`Common`, `Home`, `Reading`, `Credits`, `Login`).
- Use camelCase for translation key names (e.g. `selectDeckTitle`, `dragOrTapHint`).

## 2. Mandatory Synchronization Rule
- **Both files must be updated simultaneously**: Whenever a new translation key is added to `messages/vi.json`, it **MUST** be added to `messages/en.json` with accurate English phrasing, and vice-versa.
- Avoid missing translation keys to prevent `MISSING_MESSAGE` warnings during Vitest runs or browser execution.

## 3. Usage in Components
- Server Components / Pages: Use `getTranslations({ locale, namespace: 'Reading' })`.
- Client Components: Use `const t = useTranslations('Reading')`.
- Dynamic Plurals: Use `{count, plural, one {# lá} other {# lá}}`.
