# Prompt dự án web app Tarot dùng PostgreSQL

## Tóm tắt điều hành

Tài liệu này là một **prompt/spec hoàn chỉnh bằng tiếng Việt** để giao cho đội kỹ sư hoặc AI coding agent triển khai một **Tarot web app** có backend dùng **PostgreSQL** làm nguồn dữ liệu trung tâm. Kiến trúc được đề xuất ưu tiên **Node.js + TypeScript**, frontend có thể dùng **Next.js**, API có thể đi theo **Fastify** hoặc **Next.js Route Handlers**, ORM ưu tiên **Prisma** nếu đội muốn type-safety và quy trình migration rõ ràng. Ở tầng dữ liệu, PostgreSQL phù hợp vì hỗ trợ tốt dữ liệu quan hệ, `jsonb`, UUID, Row-Level Security, full-text search, partial indexes, và fuzzy search qua `pg_trgm`; nếu dùng Supabase, hệ thống còn có sẵn Auth, JWT, RLS và REST API sinh tự động từ schema. citeturn0search0turn1search1turn1search2turn1search9turn14search1turn14search7turn18search0turn18search1turn18search2turn18search8

Về vận hành, prompt này giả định sản phẩm đi theo lộ trình: **MVP trước, AI và thanh toán sau**, nhưng vẫn thiết kế schema ngay từ đầu để không phải phá dữ liệu khi mở rộng. Riêng AI diễn giải nên dùng **structured outputs / JSON Schema** để đầu ra bám chặt schema, thay vì parse tự do; đối với subscription, **Stripe** là lựa chọn tốt nhất cho recurring billing nhờ tài liệu webhook/subscription rõ ràng, còn nếu thị trường chính là Việt Nam thì có thể thêm một lớp adapter cho **payOS** hoặc cổng thanh toán nội địa ở giai đoạn sau. citeturn17search0turn17search1turn17search2turn0search2turn0search6turn16search0turn16search3turn16search14

Các khuyến nghị về bảo mật, sao lưu, giám sát và CI/CD trong tài liệu bám vào tài liệu chính thức của PostgreSQL, OWASP, Docker, GitHub Actions, OpenTelemetry và Sentry. PostgreSQL khuyến nghị ba họ giải pháp backup là SQL dump, file-system backup và continuous archiving; GitHub Actions hỗ trợ secrets, caching và môi trường triển khai; Docker Compose hỗ trợ healthcheck và thứ tự khởi động phụ thuộc; OpenTelemetry là chuẩn vendor-neutral cho traces/metrics/logs; Sentry cung cấp error tracking, tracing và profiling cho Node.js. citeturn10search8turn10search0turn10search16turn11search1turn11search5turn11search6turn11search22turn22search1turn22search2turn22search6turn2search15turn2search7turn10search3turn10search7

## Prompt chính cho đội kỹ sư và AI agent

**Sao chép nguyên khối phần dưới đây để giao cho đội triển khai hoặc AI coding agent.**

> Bạn là **Lead Engineer + Product Engineer + Database Architect + Security Reviewer** cho dự án **Tarot Web App**.  
> Nhiệm vụ của bạn là thiết kế và triển khai một sản phẩm web hoàn chỉnh, production-ready, có **frontend web**, **backend API**, **PostgreSQL** làm nguồn dữ liệu chính, hỗ trợ **Tarot deck**, **78 lá bài**, **nhiều kiểu trải bài**, **lưu lịch sử phiên xem**, **AI diễn giải có cấu trúc**, **media & licensing tracking**, **payments/subscriptions**, **admin/audit logs**, **RLS**, **CI/CD**, **test** và **deployment**.
>
> **Mục tiêu sản phẩm**
>
> Xây một Tarot web app với trải nghiệm tốt trên mobile và desktop, có thể bắt đầu bằng MVP nhỏ nhưng nền tảng dữ liệu và API phải đủ tốt để mở rộng thành sản phẩm trả phí. Hệ thống phải hỗ trợ:
>
> - người dùng ẩn danh trải bài cơ bản;
> - người dùng đăng nhập lưu lịch sử;
> - dữ liệu bài Tarot đa ngôn ngữ Việt/Anh;
> - nhiều deck và nhiều spread;
> - AI chỉ đóng vai trò **diễn giải**, không được quyết định kết quả bốc bài;
> - cơ chế phân quyền rõ ràng cho user, reader/editor/admin;
> - lưu vết giấy phép ảnh và nguồn ảnh đầy đủ;
> - mô hình subscription và thanh toán tách biệt theo provider.
>
> **Phạm vi MVP**
>
> Phải triển khai được:
>
> | Hạng mục | MVP bắt buộc | Giai đoạn sau |
> |---|---|---|
> | Deck & cards | 1 deck mặc định, đủ 78 lá | nhiều deck, deck trả phí |
> | Ngôn ngữ | vi, en | thêm locale |
> | Spread | 1 lá, 3 lá, Celtic Cross rút gọn | custom spread builder |
> | Reading | random draw, upright/reversed, lưu session | shared reading, collaboration |
> | AI | diễn giải dạng JSON có schema | chat follow-up, semantic memory |
> | Auth | email magic link hoặc OAuth | MFA, device management |
> | Payments | schema + webhook sẵn sàng | subscription production |
> | Admin | CRUD cards/spreads/media | moderation, CMS workflow |
> | Search | search cards/spreads | semantic search bằng vector |
>
> **Nguyên tắc kiến trúc**
>
> - Frontend: Next.js + TypeScript.
> - Backend: Fastify hoặc Next.js Route Handlers.
> - Database: PostgreSQL.
> - ORM: Prisma ưu tiên; có thể dùng SQL thuần cho phần quan trọng.
> - Queue: BullMQ + Redis; nếu MVP cần đơn giản có thể dùng bảng job queue trong Postgres với `FOR UPDATE SKIP LOCKED`.
> - Auth: Supabase Auth hoặc custom JWT + refresh tokens.
> - Storage: object storage cho ảnh lá bài.
> - Billing: Stripe-first, provider adapter pattern cho payOS/VNPay về sau.
> - Observability: OpenTelemetry + Sentry.
> - Test: unit + integration + E2E Playwright.
>
> **Kết quả bàn giao**
>
> 1. Monorepo hoặc repo rõ ràng với `apps/web`, `apps/api`, `packages/db`, `packages/shared`.
> 2. SQL migrations chạy được từ đầu.
> 3. Seed dữ liệu tạo ít nhất 1 deck, 78 cards, 3 spreads mẫu.
> 4. API REST hoàn chỉnh; GraphQL là tuỳ chọn nhưng nếu có phải bọc đúng auth và rate limiting.
> 5. RLS policy ví dụ đầy đủ.
> 6. Dockerfile, docker-compose, CI workflow, backup script, seed script.
> 7. Test tối thiểu cho draw logic, auth, RLS-safe queries, billing webhook, AI interpretation pipeline.
> 8. `ATTRIBUTION.md` và hồ sơ giấy phép ảnh.
>
> **Tiêu chí chấp nhận**
>
> - Không được bốc trùng lá trong cùng một reading.
> - Không được để AI thay đổi lá bài đã rút.
> - User chỉ đọc/sửa dữ liệu của chính họ, trừ role cao hơn.
> - Media phải có source, license type, attribution text.
> - Payment webhook phải idempotent.
> - AI output phải validate theo JSON Schema.
> - Toàn bộ migration phải có thể chạy lại trên database trống.
> - Ứng dụng phải có smoke test cho login, draw, save reading, view history.
>
> **Sơ đồ triển khai khuyến nghị**
>
> ```mermaid
> flowchart LR
>   A[Next.js Web] --> B[API Layer]
>   B --> C[(PostgreSQL)]
>   B --> D[Redis/BullMQ]
>   B --> E[Object Storage]
>   B --> F[AI Provider]
>   B --> G[Billing Provider]
>   H[Admin Panel] --> B
>   I[Worker] --> C
>   I --> D
>   I --> F
>   G -->|Webhook| B
> ```
>
> **Quan điểm sản phẩm**
>
> Tarot là sản phẩm nội dung + trải nghiệm + dữ liệu có bản quyền. Thiết kế phải ưu tiên:
>
> - readability;
> - mobile-first;
> - low-latency trên thao tác rút bài;
> - dữ liệu bài chuẩn hoá;
> - auditability cho nội dung, ảnh và thanh toán;
> - khả năng thay đổi prompt/AI provider mà không phá schema.
>
> Hãy triển khai theo đúng spec dữ liệu, API, bảo mật, test và vận hành ở các phần tiếp theo của tài liệu này.

Prompt trên ưu tiên một lõi dữ liệu PostgreSQL mạnh vì PostgreSQL hỗ trợ tốt `jsonb`, full-text search, UUID, partial indexes, row-level security và có thể dùng `SKIP LOCKED` cho các workflow dạng queue; Supabase cũng có thể auto-generate REST API từ database và dùng JWT để áp RLS. citeturn0search0turn1search1turn1search2turn14search1turn14search7turn18search2turn19search0

## Kiến trúc dữ liệu PostgreSQL

Thiết kế dưới đây chia domain thành chín nhóm: **user/auth**, **tarot catalog**, **spread definition**, **reading runtime**, **AI interpretation**, **media/license**, **billing**, **admin/audit**, và **search/ops**. Với PostgreSQL, nên dùng UUID làm primary key qua `gen_random_uuid()`, `jsonb` cho payload linh hoạt, `tsvector` cho search, `pg_trgm` cho fuzzy search tên lá bài/spread, và partial indexes cho các truy vấn nóng như subscription đang hoạt động. citeturn1search1turn1search4turn0search0turn18search0turn18search1turn18search2turn18search5

```mermaid
erDiagram
  profiles ||--o{ user_roles : has
  profiles ||--o{ reading_sessions : owns
  decks ||--o{ deck_cards : contains
  cards ||--o{ deck_cards : mapped
  cards ||--o{ card_localizations : localized
  cards ||--o{ card_media : illustrated_by
  spreads ||--o{ spread_positions : defines
  reading_sessions ||--o{ reading_draws : draws
  reading_sessions ||--o{ interpretations : interpreted
  media_assets ||--o{ card_media : linked
  license_records ||--o{ media_assets : governs
  profiles ||--o{ billing_customers : billed_as
  billing_customers ||--o{ subscriptions : owns
  subscriptions ||--o{ payments : invoices
  profiles ||--o{ audit_logs : acts
  profiles ||--o{ admin_actions : acts
  payments ||--o{ webhook_events : source
```

| Bảng | Mục đích | Khóa chính | Quan hệ chính | Index khuyến nghị |
|---|---|---|---|---|
| `profiles` | hồ sơ app-level, bọc quanh auth user | `id uuid` | 1-n `reading_sessions`, `billing_customers`, `audit_logs` | unique `email`, `handle` |
| `user_roles` | gán role nhiều-một hoặc nhiều-nhiều | `id uuid` | n-1 `profiles` | unique `(user_id, role)` |
| `decks` | bộ bài | `id uuid` | 1-n `deck_cards` | unique `slug` |
| `cards` | lá bài canonical | `id uuid` | 1-n `card_localizations`, `card_media` | unique `canonical_slug` |
| `deck_cards` | mapping deck-card + thứ tự | `id uuid` | n-1 `decks`, n-1 `cards` | unique `(deck_id, card_id)` |
| `card_localizations` | tên/ý nghĩa vi/en | `id uuid` | n-1 `cards` | unique `(card_id, locale)` |
| `media_assets` | metadata file ảnh | `id uuid` | 1-n `card_media` | unique `storage_key` |
| `license_records` | license/source/attribution | `id uuid` | 1-n `media_assets` | index `license_type` |
| `spreads` | định nghĩa spread | `id uuid` | 1-n `spread_positions` | unique `slug` |
| `spread_positions` | vị trí từng lá trong spread | `id uuid` | n-1 `spreads` | unique `(spread_id, position_order)` |
| `reading_sessions` | phiên rút bài | `id uuid` | 1-n `reading_draws`, `interpretations` | index `(user_id, created_at desc)` |
| `reading_draws` | lá đã rút | `id uuid` | n-1 `reading_sessions` | unique `(reading_session_id, drawn_order)` |
| `interpretations` | đầu ra AI/cached interpretation | `id uuid` | n-1 `reading_sessions` | unique `(reading_session_id, version)` |
| `billing_customers` | map user với provider customer | `id uuid` | n-1 `profiles`, 1-n `subscriptions` | unique `(provider, provider_customer_id)` |
| `subscriptions` | trạng thái gói | `id uuid` | n-1 `billing_customers` | partial index active |
| `payments` | giao dịch thanh toán | `id uuid` | n-1 `subscriptions` | unique `(provider, provider_payment_id)` |
| `webhook_events` | idempotency + trace webhook | `id uuid` | optional n-1 `payments` | unique `(provider, provider_event_id)` |
| `audit_logs` | audit chung | `id uuid` | n-1 `profiles` | index `(actor_user_id, created_at desc)` |
| `admin_actions` | hành động quản trị có cấu trúc | `id uuid` | n-1 `profiles` | index `(entity_type, entity_id)` |

**Chi tiết cột khuyến nghị**

```sql
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type app_role as enum ('user', 'reader', 'editor', 'admin', 'superadmin');
create type deck_status as enum ('draft', 'published', 'archived');
create type spread_status as enum ('draft', 'published', 'archived');
create type reading_status as enum ('pending', 'drawn', 'interpreting', 'completed', 'failed');
create type card_orientation as enum ('upright', 'reversed');
create type interpretation_status as enum ('queued', 'processing', 'completed', 'failed');
create type billing_provider as enum ('stripe', 'payos', 'manual');
create type subscription_status as enum ('incomplete', 'trialing', 'active', 'past_due', 'paused', 'canceled', 'incomplete_expired');
create type payment_status as enum ('pending', 'requires_action', 'paid', 'failed', 'refunded', 'void');
create type media_kind as enum ('card_front', 'card_back', 'thumbnail', 'spread_art', 'brand_asset');
create type license_type as enum ('public_domain', 'cc0', 'cc_by', 'cc_by_sa', 'licensed', 'custom_contract', 'unknown');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  handle text unique,
  display_name text,
  avatar_url text,
  locale text not null default 'vi',
  tz text not null default 'Asia/Bangkok',
  is_active boolean not null default true,
  marketing_consent boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_chk check (position('@' in email) > 1)
);

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  role app_role not null,
  granted_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table decks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null unique,
  name text not null,
  description text,
  status deck_status not null default 'draft',
  is_default boolean not null default false,
  total_cards int not null default 78,
  locale_fallback text not null default 'en',
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint decks_total_cards_chk check (total_cards > 0)
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  canonical_slug text not null unique,
  arcana text not null check (arcana in ('major', 'minor')),
  suit text check (suit in ('wands', 'cups', 'swords', 'pentacles') or suit is null),
  rank text,
  major_number smallint,
  deck_system text not null default 'rider-waite-smith',
  canonical_order smallint not null,
  astrology jsonb not null default '{}'::jsonb,
  numerology jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table deck_cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references decks(id) on delete cascade,
  card_id uuid not null references cards(id) on delete restrict,
  deck_order smallint not null,
  is_enabled boolean not null default true,
  unique (deck_id, card_id),
  unique (deck_id, deck_order)
);

create table card_localizations (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  locale text not null,
  name text not null,
  short_name text,
  keywords_upright text[] not null default '{}',
  keywords_reversed text[] not null default '{}',
  meaning_upright text not null,
  meaning_reversed text not null,
  description text,
  love_meaning jsonb not null default '{}'::jsonb,
  career_meaning jsonb not null default '{}'::jsonb,
  spiritual_meaning jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  search_document tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (card_id, locale)
);

create table license_records (
  id uuid primary key default gen_random_uuid(),
  license_type license_type not null,
  source_name text not null,
  source_url text,
  source_page_url text,
  rights_statement text,
  requires_attribution boolean not null default true,
  attribution_text text,
  author_name text,
  original_title text,
  publish_year int,
  contract_reference text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_provider text not null default 's3',
  bucket text,
  storage_key text not null unique,
  file_name text not null,
  mime_type text not null,
  width int,
  height int,
  size_bytes bigint,
  checksum_sha256 text,
  public_url text,
  blurhash text,
  kind media_kind not null,
  license_record_id uuid not null references license_records(id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table card_media (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  media_asset_id uuid not null references media_assets(id) on delete restrict,
  locale text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (card_id, media_asset_id)
);

create table spreads (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  locale text not null default 'vi',
  description text,
  card_count smallint not null,
  status spread_status not null default 'draft',
  is_premium boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint spreads_card_count_chk check (card_count > 0 and card_count <= 20)
);

create table spread_positions (
  id uuid primary key default gen_random_uuid(),
  spread_id uuid not null references spreads(id) on delete cascade,
  position_order smallint not null,
  key text not null,
  label text not null,
  meaning_prompt text,
  x numeric(6,2),
  y numeric(6,2),
  rotation_deg numeric(6,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  unique (spread_id, position_order),
  unique (spread_id, key)
);

create table reading_sessions (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  user_id uuid references profiles(id) on delete set null,
  deck_id uuid not null references decks(id) on delete restrict,
  spread_id uuid not null references spreads(id) on delete restrict,
  locale text not null default 'vi',
  question text,
  focus_area text,
  draw_seed bytea,
  draw_algorithm text not null default 'fisher-yates-csprng-v1',
  status reading_status not null default 'pending',
  allow_reversed boolean not null default true,
  is_anonymous boolean not null default false,
  is_public boolean not null default false,
  shared_slug text unique,
  client_fingerprint text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table reading_draws (
  id uuid primary key default gen_random_uuid(),
  reading_session_id uuid not null references reading_sessions(id) on delete cascade,
  card_id uuid not null references cards(id) on delete restrict,
  spread_position_id uuid not null references spread_positions(id) on delete restrict,
  drawn_order smallint not null,
  orientation card_orientation not null,
  is_jumper boolean not null default false,
  random_value numeric(12,10),
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (reading_session_id, drawn_order),
  unique (reading_session_id, spread_position_id),
  unique (reading_session_id, card_id)
);

create table interpretations (
  id uuid primary key default gen_random_uuid(),
  reading_session_id uuid not null references reading_sessions(id) on delete cascade,
  provider text not null,
  model text not null,
  version int not null default 1,
  status interpretation_status not null default 'queued',
  prompt_snapshot jsonb not null default '{}'::jsonb,
  input_snapshot jsonb not null default '{}'::jsonb,
  output_json jsonb,
  output_text text,
  token_usage jsonb not null default '{}'::jsonb,
  latency_ms int,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (reading_session_id, version)
);

create table billing_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider billing_provider not null,
  provider_customer_id text not null,
  email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (provider, provider_customer_id),
  unique (user_id, provider)
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  billing_customer_id uuid not null references billing_customers(id) on delete cascade,
  provider billing_provider not null,
  provider_subscription_id text not null,
  plan_code text not null,
  status subscription_status not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  quantity int not null default 1,
  price_amount_cents int,
  price_currency text not null default 'USD',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references subscriptions(id) on delete set null,
  billing_customer_id uuid references billing_customers(id) on delete set null,
  provider billing_provider not null,
  provider_payment_id text not null,
  provider_invoice_id text,
  amount_cents int not null,
  currency text not null default 'USD',
  status payment_status not null,
  paid_at timestamptz,
  refunded_at timestamptz,
  failure_reason text,
  receipt_url text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

create table webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider billing_provider not null,
  provider_event_id text not null,
  event_type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'received',
  payload jsonb not null,
  signature_header text,
  error_message text,
  payment_id uuid references payments(id) on delete set null,
  unique (provider, provider_event_id)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  request_id text,
  ip inet,
  user_agent text,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default now()
);

create table admin_actions (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references profiles(id) on delete restrict,
  action text not null,
  target_table text not null,
  target_id text not null,
  reason text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_profiles_email on profiles (email);
create index idx_user_roles_user on user_roles (user_id);
create index idx_card_localizations_search on card_localizations using gin (search_document);
create index idx_card_localizations_name_trgm on card_localizations using gin (name gin_trgm_ops);
create index idx_reading_sessions_user_created on reading_sessions (user_id, created_at desc);
create index idx_reading_sessions_public on reading_sessions (is_public, created_at desc) where is_public = true;
create index idx_interpretations_status_created on interpretations (status, created_at);
create index idx_subscriptions_active on subscriptions (billing_customer_id, current_period_end desc)
where status in ('trialing', 'active', 'past_due');
create index idx_payments_customer_created on payments (billing_customer_id, created_at desc);
create index idx_audit_logs_actor_created on audit_logs (actor_user_id, created_at desc);
```

**Gợi ý trigger/search**

```sql
create function set_card_localizations_search_document()
returns trigger
language plpgsql
as $$
begin
  new.search_document :=
    setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('simple', array_to_string(new.keywords_upright, ' ')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(new.keywords_reversed, ' ')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.meaning_upright, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(new.meaning_reversed, '')), 'C');
  return new;
end;
$$;

create trigger trg_card_localizations_search_document
before insert or update on card_localizations
for each row execute function set_card_localizations_search_document();
```

`jsonb` phù hợp cho metadata và snapshot prompt/output vì PostgreSQL hỗ trợ JSON nhị phân và lập chỉ mục tốt; `tsvector`/`tsquery` phục vụ full-text search; `pg_trgm` phù hợp cho fuzzy search tên lá bài; partial indexes có ích khi chỉ cần index một tập con như subscription đang hoạt động. citeturn0search0turn18search0turn18search1turn18search7turn18search2turn18search5

**Seed dữ liệu mẫu**

```sql
insert into decks (slug, code, name, description, status, is_default, total_cards)
values
('rider-waite-smith', 'RWS', 'Rider–Waite–Smith', 'Bộ bài mặc định cho MVP', 'published', true, 78);

insert into spreads (slug, name, locale, description, card_count, status, is_premium)
values
('single-card', 'Rút một lá', 'vi', 'Một lá cho thông điệp chính', 1, 'published', false),
('past-present-future', 'Quá khứ - Hiện tại - Tương lai', 'vi', 'Spread 3 lá cơ bản', 3, 'published', false),
('three-card', 'Three Card Reading', 'en', 'General 3-card spread', 3, 'published', false);

insert into spread_positions (spread_id, position_order, key, label, meaning_prompt, x, y)
select id, 1, 'message', 'Thông điệp', 'Tóm tắt lá bài thành thông điệp chính cho người dùng.', 0, 0
from spreads where slug = 'single-card';

insert into spread_positions (spread_id, position_order, key, label, meaning_prompt, x, y)
select id, 1, 'past', 'Quá khứ', 'Giải thích năng lượng từ quá khứ ảnh hưởng đến hiện tại.', -120, 0
from spreads where slug = 'past-present-future';

insert into spread_positions (spread_id, position_order, key, label, meaning_prompt, x, y)
select id, 2, 'present', 'Hiện tại', 'Giải thích bối cảnh hiện tại và bài học đang diễn ra.', 0, 0
from spreads where slug = 'past-present-future';

insert into spread_positions (spread_id, position_order, key, label, meaning_prompt, x, y)
select id, 3, 'future', 'Tương lai', 'Giải thích xu hướng gần nếu người dùng tiếp tục theo quỹ đạo hiện tại.', 120, 0
from spreads where slug = 'past-present-future';
```

**JSON mẫu cho một lá bài, song ngữ Việt/Anh**

```json
{
  "card": {
    "canonical_slug": "major-the-fool",
    "arcana": "major",
    "major_number": 0,
    "canonical_order": 1,
    "deck_system": "rider-waite-smith",
    "astrology": {
      "planet": "Uranus",
      "element": "Air"
    },
    "numerology": {
      "number": 0,
      "themes": ["potential", "beginning", "freedom"]
    }
  },
  "localizations": [
    {
      "locale": "vi",
      "name": "Kẻ Khờ",
      "short_name": "The Fool",
      "keywords_upright": ["khởi đầu", "tự do", "niềm tin", "phiêu lưu"],
      "keywords_reversed": ["bốc đồng", "thiếu chuẩn bị", "trốn tránh trách nhiệm"],
      "meaning_upright": "Một khởi đầu mới đang mở ra. Lá bài này nói về niềm tin, bước nhảy của trực giác và tinh thần dám trải nghiệm.",
      "meaning_reversed": "Cần chậm lại để tránh sự bốc đồng. Bạn có thể đang bỏ qua chi tiết quan trọng hoặc hành động khi chưa sẵn sàng.",
      "description": "Lá bài số 0 của Major Arcana, tượng trưng cho tiềm năng vô hạn và hành trình mới.",
      "love_meaning": {
        "upright": "Tình cảm mới, cơ hội mở lòng, sự hồn nhiên trong kết nối.",
        "reversed": "Né tránh cam kết hoặc lý tưởng hóa đối phương."
      },
      "career_meaning": {
        "upright": "Thử điều mới, chuyển hướng nghề nghiệp, dự án khởi động.",
        "reversed": "Thiếu kế hoạch, rủi ro không được đánh giá đúng."
      },
      "spiritual_meaning": {
        "upright": "Tin vào hành trình linh hồn.",
        "reversed": "Mất kết nối với trực giác."
      }
    },
    {
      "locale": "en",
      "name": "The Fool",
      "short_name": "The Fool",
      "keywords_upright": ["beginnings", "freedom", "faith", "adventure"],
      "keywords_reversed": ["recklessness", "naivety", "poor preparation"],
      "meaning_upright": "A new path is opening. This card points to trust, intuitive leaps, and a willingness to explore.",
      "meaning_reversed": "Slow down to avoid reckless choices. Important details may be ignored or you may be acting before you are ready.",
      "description": "Major Arcana card 0, representing infinite potential and the start of the journey.",
      "love_meaning": {
        "upright": "Fresh romantic energy and emotional openness.",
        "reversed": "Avoidance of commitment or unrealistic expectations."
      },
      "career_meaning": {
        "upright": "Try something new, pivot, launch a project.",
        "reversed": "Poor planning and underestimated risk."
      },
      "spiritual_meaning": {
        "upright": "Trust the soul's journey.",
        "reversed": "Disconnection from intuition."
      }
    }
  ]
}
```

**Ràng buộc dữ liệu nghiệp vụ bắt buộc**

| Quy tắc | Cách chặn ở DB | Cách chặn ở app |
|---|---|---|
| đủ 78 lá cho deck mặc định | seed validation + admin check | startup assertion |
| không trùng lá trong 1 reading | unique `(reading_session_id, card_id)` | service-level transaction |
| đúng số lá theo spread | trigger/check khi finalize reading | validate trước khi insert |
| chỉ 1 media primary/card | partial unique index hoặc trigger | admin UI guard |
| webhook idempotent | unique `(provider, provider_event_id)` | handler retry-safe |
| 1 active subscription/provider/user | unique `(user_id, provider)` ở `billing_customers` + partial index | service-level enforcement |

## API, phân quyền và business logic

Với Supabase/PostgREST, bạn có thể lấy REST API tự động từ schema và dùng resource embedding/filtering ngay ở tầng Data API; nếu đội cần BFF để che giấu cấu trúc bảng, áp rate limiting và gom business logic, hãy đặt thêm một lớp REST “ứng dụng” phía trên PostgreSQL. Nếu dùng GraphQL, nên bọc ở một endpoint riêng theo tinh thần GraphQL over HTTP và chỉ cho phép các operation đã kiểm soát thay vì mở introspection/public schema bừa bãi trong production. citeturn14search1turn14search7turn14search0turn14search3turn9search0turn9search6turn14search2turn14search16

**Mô hình authentication/authorization**

Supabase mô tả session bằng **JWT access token** + **refresh token**; access token ngắn hạn, refresh token dùng một lần để đổi ra cặp token mới. JWT claims có thể được thêm custom claims để triển khai RBAC, và RLS dùng `auth.uid()` / `auth.jwt()` để viết policy. citeturn15search1turn15search3turn15search5turn1search9turn1search14

| Role | Quyền |
|---|---|
| `anon` | xem spreads/cards public, tạo reading ẩn danh giới hạn |
| `authenticated user` | tạo reading, lưu lịch sử của chính mình, xem subscription của chính mình |
| `reader` | xem dashboard reader, xem aggregated stats không nhạy cảm |
| `editor` | CRUD cards/spreads/media nội dung |
| `admin` | full admin panel, xem audit logs, quản lý billing issues |
| `superadmin` | bypass nội bộ qua service role, không expose ra client |

**Ví dụ RLS với Supabase/Postgres**

```sql
alter table profiles enable row level security;
alter table reading_sessions enable row level security;
alter table reading_draws enable row level security;
alter table interpretations enable row level security;
alter table billing_customers enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;

create policy "profiles_select_self"
on profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_self"
on profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "reading_sessions_select_owner_or_public"
on reading_sessions
for select
to authenticated, anon
using (
  is_public = true
  or (select auth.uid()) = user_id
);

create policy "reading_sessions_insert_self_or_anon"
on reading_sessions
for insert
to authenticated, anon
with check (
  ((select auth.uid()) = user_id)
  or (user_id is null and is_anonymous = true)
);

create policy "reading_draws_select_if_parent_visible"
on reading_draws
for select
to authenticated, anon
using (
  exists (
    select 1
    from reading_sessions rs
    where rs.id = reading_draws.reading_session_id
      and (rs.is_public = true or rs.user_id = (select auth.uid()))
  )
);

create policy "interpretations_select_owner_only"
on interpretations
for select
to authenticated
using (
  exists (
    select 1
    from reading_sessions rs
    where rs.id = interpretations.reading_session_id
      and rs.user_id = (select auth.uid())
  )
);

create policy "subscriptions_select_owner_only"
on subscriptions
for select
to authenticated
using (
  exists (
    select 1
    from billing_customers bc
    where bc.id = subscriptions.billing_customer_id
      and bc.user_id = (select auth.uid())
  )
);
```

Supabase khuyến nghị viết policy với `(select auth.uid())` thay vì gọi hàm lặp trên từng hàng để Postgres có thể tối ưu tốt hơn; RLS của PostgreSQL áp kiểm soát theo hàng, còn column-level privileges có thể bổ sung nếu cần chặn cột nhạy cảm. citeturn1search2turn1search10turn0search4

**REST API ứng dụng đề xuất**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| `GET` | `/v1/health` | none | healthcheck |
| `GET` | `/v1/decks` | optional | danh sách deck public |
| `GET` | `/v1/decks/:slug/cards` | optional | danh sách 78 lá theo locale |
| `GET` | `/v1/cards` | optional | search/filter cards |
| `GET` | `/v1/cards/:slug` | optional | chi tiết 1 lá |
| `GET` | `/v1/spreads` | optional | spreads public |
| `POST` | `/v1/readings` | optional | tạo reading session |
| `POST` | `/v1/readings/:publicId/draw` | optional | rút bài |
| `POST` | `/v1/readings/:publicId/interpret` | optional/auth | enqueue AI interpretation |
| `GET` | `/v1/readings/:publicId` | owner/public | đọc kết quả session |
| `GET` | `/v1/me/readings` | auth | lịch sử của tôi |
| `POST` | `/v1/auth/refresh` | refresh token | cấp lại session |
| `GET` | `/v1/me/subscription` | auth | gói hiện tại |
| `POST` | `/v1/billing/checkout-session` | auth | tạo checkout |
| `POST` | `/v1/webhooks/stripe` | provider webhook | nhận sự kiện Stripe |
| `POST` | `/v1/admin/cards` | editor+ | tạo card |
| `PATCH` | `/v1/admin/cards/:id` | editor+ | cập nhật card |
| `GET` | `/v1/admin/audit-logs` | admin+ | xem log |

**Ví dụ tạo reading**

```http
POST /v1/readings
Content-Type: application/json

{
  "deckSlug": "rider-waite-smith",
  "spreadSlug": "past-present-future",
  "locale": "vi",
  "question": "Tôi nên tập trung điều gì trong 3 tháng tới?",
  "allowReversed": true,
  "isAnonymous": true
}
```

```json
{
  "reading": {
    "publicId": "rdg_01K1X9F8Z9R4W4C6F4G0Q8D2A5",
    "status": "pending",
    "deckSlug": "rider-waite-smith",
    "spreadSlug": "past-present-future",
    "cardCount": 3,
    "createdAt": "2026-07-29T10:25:12.000Z"
  }
}
```

**Ví dụ draw**

```http
POST /v1/readings/rdg_01K1X9F8Z9R4W4C6F4G0Q8D2A5/draw
Content-Type: application/json
```

```json
{
  "reading": {
    "publicId": "rdg_01K1X9F8Z9R4W4C6F4G0Q8D2A5",
    "status": "drawn"
  },
  "draws": [
    {
      "positionKey": "past",
      "positionLabel": "Quá khứ",
      "cardSlug": "major-the-fool",
      "name": "Kẻ Khờ",
      "orientation": "upright",
      "imageUrl": "https://cdn.example.com/cards/major/00-the-fool.webp"
    },
    {
      "positionKey": "present",
      "positionLabel": "Hiện tại",
      "cardSlug": "minor-eight-of-cups",
      "name": "Tám Ly",
      "orientation": "reversed",
      "imageUrl": "https://cdn.example.com/cards/cups/eight-of-cups.webp"
    },
    {
      "positionKey": "future",
      "positionLabel": "Tương lai",
      "cardSlug": "major-the-star",
      "name": "Ngôi Sao",
      "orientation": "upright",
      "imageUrl": "https://cdn.example.com/cards/major/17-the-star.webp"
    }
  ]
}
```

**Ví dụ enqueue AI interpretation**

```http
POST /v1/readings/rdg_01K1X9F8Z9R4W4C6F4G0Q8D2A5/interpret
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "tone": "empathetic",
  "depth": "standard",
  "includeReflectionQuestions": true
}
```

```json
{
  "interpretation": {
    "id": "int_01K1XAG2QF13J7N1QVE0R3M0PK",
    "status": "queued",
    "provider": "openai",
    "model": "gpt-4.1-mini",
    "version": 1
  }
}
```

**Error envelope thống nhất**

```json
{
  "error": {
    "code": "READING_ALREADY_DRAWN",
    "message": "Phiên trải bài này đã rút xong.",
    "requestId": "req_01K1XB...",
    "details": {
      "publicId": "rdg_01K1X9..."
    }
  }
}
```

| HTTP | `code` | Trường hợp |
|---|---|---|
| `400` | `VALIDATION_ERROR` | payload sai schema |
| `401` | `UNAUTHENTICATED` | thiếu hoặc sai access token |
| `403` | `FORBIDDEN` | không đủ role |
| `404` | `NOT_FOUND` | không có resource |
| `409` | `READING_ALREADY_DRAWN` | gọi draw lần hai |
| `409` | `DUPLICATE_WEBHOOK` | event webhook đã xử lý |
| `422` | `AI_OUTPUT_INVALID` | output AI không qua schema validation |
| `429` | `RATE_LIMITED` | vượt quota |
| `500` | `INTERNAL_ERROR` | lỗi không phân loại |
| `503` | `QUEUE_UNAVAILABLE` | hàng đợi/worker tạm lỗi |

**Ví dụ GraphQL tùy chọn**

```graphql
query ReadingByPublicId($publicId: String!) {
  reading(publicId: $publicId) {
    publicId
    status
    spread {
      slug
      name
      positions {
        key
        label
      }
    }
    draws {
      orientation
      position {
        key
        label
      }
      card(locale: "vi") {
        canonicalSlug
        name
        meaningUpright
        meaningReversed
      }
    }
  }
}
```

```graphql
mutation CreateReading($input: CreateReadingInput!) {
  createReading(input: $input) {
    publicId
    status
    deck {
      slug
    }
    spread {
      slug
      cardCount
    }
  }
}
```

**Business logic bắt buộc**

| Luật | Định nghĩa |
|---|---|
| Shuffle | Fisher–Yates/Durstenfeld trên danh sách card IDs, dùng CSPRNG |
| No duplicate | bốc theo permutation duy nhất của deck |
| Upright/Reversed | mỗi lá có cờ orientation độc lập; nếu `allowReversed=false` thì luôn `upright` |
| Spread mapping | `drawn_order` map 1-1 sang `spread_position.position_order` |
| Immutable result | sau khi draw xong, không đổi card/orientation nữa |
| AI flow | AI chỉ đọc snapshot của reading đã rút, xuất JSON đúng schema |
| Idempotency | webhook, interpretation retry, payment updates phải re-entrant |

Node.js có module `crypto` cho random bảo mật; PostgreSQL có thể dùng `FOR UPDATE SKIP LOCKED` nếu cần worker dựa trên bảng queue; còn Stripe yêu cầu webhook endpoint và khuyến nghị xác minh sự kiện đến từ Stripe. citeturn8search1turn19search0turn19search2turn0search2turn0search6

**Pseudo-code shuffle/draw bằng TypeScript**

```ts
import { randomInt, randomBytes } from "node:crypto";

export function shuffleCardIds(cardIds: string[]): { seed: Buffer; shuffled: string[] } {
  const arr = [...cardIds];
  const seed = randomBytes(32);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return { seed, shuffled: arr };
}

export function drawReading(params: {
  cardIds: string[];
  spreadPositionIds: string[];
  allowReversed: boolean;
}) {
  const { shuffled, seed } = shuffleCardIds(params.cardIds);
  const selected = shuffled.slice(0, params.spreadPositionIds.length);

  return {
    seed,
    draws: selected.map((cardId, index) => ({
      cardId,
      spreadPositionId: params.spreadPositionIds[index],
      drawnOrder: index + 1,
      orientation: params.allowReversed && randomInt(0, 2) === 1 ? "reversed" : "upright"
    }))
  };
}
```

**JSON Schema đầu ra AI**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["overview", "cards", "synthesis", "advice", "reflectionQuestions", "disclaimer"],
  "properties": {
    "overview": { "type": "string", "minLength": 20 },
    "cards": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["positionKey", "cardSlug", "orientation", "interpretation"],
        "properties": {
          "positionKey": { "type": "string" },
          "cardSlug": { "type": "string" },
          "orientation": { "type": "string", "enum": ["upright", "reversed"] },
          "interpretation": { "type": "string" }
        }
      }
    },
    "synthesis": { "type": "string" },
    "advice": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 2
    },
    "reflectionQuestions": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 2
    },
    "disclaimer": { "type": "string" }
  }
}
```

Structured Outputs của OpenAI cho phép model trả về dữ liệu bám JSON Schema chặt chẽ, giảm rủi ro thiếu key hoặc enum sai; nếu không dùng structured outputs thì cần validate lại với thư viện schema và có retry policy. citeturn17search0turn17search1turn17search2turn17search3

## Vận hành, bảo mật, kiểm thử và bản quyền

**Tech stack đề xuất**

| Tầng | Khuyến nghị chính | Thay thế hợp lý |
|---|---|---|
| Frontend | Next.js + TypeScript | React SPA + Fastify |
| API | Fastify | Next.js Route Handlers |
| ORM | Prisma | Drizzle, SQL thuần |
| DB | PostgreSQL | Supabase Postgres |
| Queue | BullMQ + Redis | Postgres queue với `SKIP LOCKED` |
| AI | OpenAI Structured Outputs | provider khác có JSON schema |
| Billing | Stripe | payOS adapter cho one-off/local |
| Search | Postgres FTS + pg_trgm | pgvector khi cần semantic |
| Observability | OpenTelemetry + Sentry | Datadog/New Relic nếu đội đã có |

Fastify nhấn mạnh hiệu năng cao và plugin architecture; BullMQ là queue Redis-based, TypeScript-first; Supabase có hơn 50 extension và hỗ trợ `pgvector`, `pg_cron`; PostgreSQL full-text search và `pg_trgm` đủ tốt cho search nhỏ đến vừa mà chưa cần Elasticsearch. citeturn2search1turn2search2turn13search3turn13search1turn13search18turn18search0turn18search1

**CI/CD và Docker**

Docker Compose phù hợp cho local stack nhiều service; healthcheck và `depends_on` giúp điều phối thứ tự khởi động; multi-stage builds giúp giảm kích thước image và bề mặt tấn công. GitHub Actions hỗ trợ secrets, caching dependency và environments cho triển khai nhiều môi trường. citeturn22search6turn22search1turn22search2turn22search13turn11search1turn11search5turn11search6turn11search24

```yaml
services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_USER: tarot
      POSTGRES_PASSWORD: tarot
      POSTGRES_DB: tarot
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tarot -d tarot"]
      interval: 5s
      timeout: 5s
      retries: 10
    volumes:
      - pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  api:
    build:
      context: .
      dockerfile: ./apps/api/Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://tarot:tarot@postgres:5432/tarot
      REDIS_URL: redis://redis:6379
    ports:
      - "3001:3001"

  web:
    build:
      context: .
      dockerfile: ./apps/web/Dockerfile
    depends_on:
      - api
    ports:
      - "3000:3000"

volumes:
  pg_data:
```

**Migrations, backup và dữ liệu**

Prisma Migrate giữ schema và migration đồng bộ; PostgreSQL khuyến nghị backup định kỳ, và phân ba cách chính: SQL dump, file system backup, continuous archiving. Với MVP, tối thiểu nên có **nightly `pg_dump -Fc`**, giữ 7–30 bản, cộng với snapshot của managed Postgres. Với production quan trọng, cần PITR/continuous archiving ở tầng managed service nếu nhà cung cấp hỗ trợ. citeturn3search3turn3search11turn3search20turn10search8turn10search0turn10search4turn10search16

```bash
pg_dump "$DATABASE_URL" -Fc -f "./backups/tarot-$(date +%F-%H%M).dump"
pg_restore --list "./backups/tarot-2026-07-29-0200.dump"
```

**Background jobs**

| Job | Trigger | Hàng đợi | Retry | Idempotency key |
|---|---|---|---|---|
| AI interpretation | user bấm interpret hoặc auto sau draw | `interpretation` | 3–5 | `reading_session_id + version` |
| Email magic link / receipt | auth/billing events | `email` | 5 | `event_id` |
| Billing sync | webhook hoặc cron | `billing` | 10 | `provider_event_id` |
| Image optimization | admin upload media | `media` | 3 | `media_asset_id + transform` |
| Cleanup | nightly cron | `maintenance` | 1 | job date |

Nếu đội chưa muốn duy trì Redis, có thể dựng một bảng `jobs` trong Postgres và dùng worker đọc job bằng `FOR UPDATE SKIP LOCKED`; PostgreSQL cho biết cách này phù hợp cho queue-like workloads dù không nên dùng như một cơ chế locking chung cho mọi loại công việc. citeturn19search0turn19search2turn2search2turn2search6

**Monitoring và observability**

OpenTelemetry là framework vendor-neutral cho traces/metrics/logs; Sentry cho Node.js hỗ trợ error tracking, tracing và profiling. Khuyến nghị instrument tối thiểu: HTTP inbound, DB query timing, queue latency, AI latency, webhook processing time, checkout success rate, và error rate theo endpoint. citeturn2search15turn2search7turn10search3turn10search7

| Nhóm metric | Ví dụ |
|---|---|
| API | p50/p95 latency, 5xx rate, 429 rate |
| DB | connection count, slow query > 500ms, lock wait |
| Queue | queue depth, retry count, age of oldest job |
| AI | success rate, schema validation fail rate, token usage |
| Billing | webhook lag, payment success rate, refund rate |
| Product | readings/day, interpretation attach rate, subscription conversion |

**Security & privacy checklist**

OWASP API Security Top 10 2023 nhấn mạnh đặc biệt tới Broken Object Level Authorization, Broken Authentication, Broken Function Level Authorization, Unrestricted Access to Sensitive Business Flows, Security Misconfiguration và Unsafe Consumption of APIs. Với dự án Tarot, các vùng rủi ro chính là lộ lịch sử reading của người khác, admin endpoint bị lộ, webhook giả mạo, output AI không kiểm soát, và lạm dụng flow đọc bài miễn phí. citeturn0search3turn0search7turn19search6

| Mục | Yêu cầu |
|---|---|
| Auth | access token ngắn hạn, refresh token rotation |
| Authorization | RLS ở DB + guard ở API |
| Input validation | JSON Schema/Zod trên mọi endpoint |
| Rate limiting | theo IP + user + endpoint + business flow |
| Webhook security | verify chữ ký Stripe/payOS, idempotency |
| Secrets | giữ trong CI secret manager, không hardcode |
| PII | tối thiểu hoá dữ liệu câu hỏi người dùng, mã hoá khi cần |
| Logging | redact email/token/provider secret |
| File upload | kiểm MIME type, kích thước, virus scan nếu public upload |
| AI safety | không đưa lời khuyên y tế/pháp lý/tài chính quyết định |
| Admin access | audit log, MFA nếu có |
| DB | least privilege, service role không ở client |

Redis mô tả rate limiting là kỹ thuật kiểm soát số request theo khoảng thời gian để ổn định và bảo vệ hệ thống; GitHub Actions secrets chỉ được đọc khi workflow khai báo rõ; Stripe webhooks cần endpoint HTTPS và xác minh sự kiện hợp lệ. citeturn8search3turn8search7turn11search6turn11search8turn0search2turn0search6

**Testing plan**

Playwright hỗ trợ Chromium, Firefox và WebKit từ một API thống nhất, phù hợp cho E2E web app; nên có đủ unit, integration và E2E. citeturn3search0turn3search4

| Lớp test | Nội dung |
|---|---|
| Unit | shuffle, orientation, spread mapping, AI schema validation |
| Integration | repository queries, RLS-safe service logic, webhook idempotency |
| Contract | API request/response schema, error envelope |
| E2E | anonymous reading, login + save history, checkout stub, admin edit card |
| Security smoke | unauthorized access, rate limit, forbidden admin routes |

**Playwright mẫu**

```ts
import { test, expect } from "@playwright/test";

test("anonymous user can complete a three-card reading", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /bắt đầu/i }).click();
  await page.getByRole("button", { name: /quá khứ/i }).click();

  await page.getByRole("textbox", { name: /câu hỏi/i }).fill("Tôi nên tập trung điều gì?");
  await page.getByRole("button", { name: /rút bài/i }).click();

  await expect(page.getByText(/quá khứ/i)).toBeVisible();
  await expect(page.getByText(/hiện tại/i)).toBeVisible();
  await expect(page.getByText(/tương lai/i)).toBeVisible();
});

test("user cannot open another user's private reading", async ({ request }) => {
  const res = await request.get("/v1/readings/rdg_private_other_user");
  expect([401, 403, 404]).toContain(res.status());
});
```

**Bản quyền, ảnh lá bài và `ATTRIBUTION.md`**

Nếu dùng ảnh Rider–Waite–Smith nguyên bản, nguồn thực tế an toàn nhất cho MVP thường là **Wikimedia Commons** với từng file có trang license riêng; Commons ghi rõ bộ Rider–Waite gốc thuộc public domain ở Mỹ và Anh, nhưng cảnh báo rằng một số phiên bản colorized/phái sinh có thể vẫn còn bản quyền. Openverse là công cụ tìm media license mở; The Met Open Access cung cấp ảnh public-domain dưới CC0 cho mục đích thương mại và phi thương mại khi tác phẩm mang biểu tượng OA. citeturn6search4turn6search0turn6search3turn6search15turn7search1turn7search2turn7search5turn6search1turn6search9

```md
# ATTRIBUTION.md

## Tarot imagery

This project uses selected tarot imagery and related media from sources that explicitly state use rights on their individual asset pages.

### Source register policy
For each image we store:
- source_name
- source_page_url
- original_title
- author_name
- license_type
- attribution_text
- local storage key
- modification notes

### Example attribution entry
- Asset: `cards/major/00-the-fool.webp`
- Source name: Wikimedia Commons
- Source page: [store original source page in DB, not hardcoded here]
- Original title: RWS Tarot 00 Fool
- Author: Pamela Colman Smith / source publication metadata
- License: Public Domain
- Notes: resized and converted to WebP for web delivery

### Internal rule
Do not import any card image into production unless a corresponding `license_records` row exists.
```

**Quy tắc sourcing nội bộ**

| Tình huống | Quy tắc |
|---|---|
| File public domain trên Commons | vẫn phải lưu source page + attribution record |
| File CC0/OA từ The Met | lưu OA link + version metadata |
| Ảnh từ repo GitHub | chỉ dùng nếu repo ghi rõ license cho **ảnh**, không chỉ cho code |
| Ảnh tự thuê illustrator | phải có hợp đồng chuyển quyền hoặc license thương mại rõ ràng |
| Ảnh từ Pinterest/Google Images/web bói khác | không dùng |

## Chi phí, lộ trình và checklist triển khai

**Khung chi phí hạ tầng**

Các mức dưới đây là **ước tính thực dụng** để lập kế hoạch, không phải báo giá ràng buộc; giá công khai biến động theo vùng, egress, số seat và mức dùng compute. Vercel công bố Hobby miễn phí và Pro từ **$20/seat/tháng**; Render công bố web service từ **$7/tháng** và Render Postgres từ **$0–$135+** tùy tier; Supabase Pro bắt đầu từ **$25/tháng** và compute/database scale theo kích thước; AWS RDS tính phí theo instance hours, storage, backup và transfer, trong khi App Runner tính theo GB-hour/vCPU-hour; AWS cũng có free tier có giới hạn cho RDS `db.t3.micro/db.t4g.micro` ở tài khoản mới. citeturn4search0turn4search1turn5search10turn4search3turn4search11turn4search15turn20search0turn20search1turn20search9turn21search0turn21search2

| Mô hình | Thành phần | Ước tính/tháng |
|---|---|---|
| MVP rất nhỏ | Vercel Hobby + Supabase Free/Nano + không Redis | `$0–$25` |
| MVP production nhỏ | Vercel Pro + Supabase Pro | `$45–$90+` |
| MVP production dùng Render | Render Web `$7` + Render Postgres `$10` + worker `$7` | `$17–$40+` |
| Production vừa | Vercel Pro + Supabase Pro/Small + Redis + Sentry | `$80–$250+` |
| Production vừa dùng Render | 1–2 web services + Postgres Standard/Pro + worker | `$49–$220+` |
| AWS tối giản | Amplify hosting ví dụ nhỏ khoảng `$8.08` + App Runner/API dùng theo giờ + RDS + backup | thường `$40–$150+` |
| AWS tăng trưởng | App Runner/ECS + RDS/Aurora + CloudWatch/S3 | `$150–$800+` |

**Ghi chú thực tế về giá**

- Nếu muốn ít vận hành nhất cho MVP: ưu tiên **Vercel + Supabase**.
- Nếu muốn gom app + DB ở một nơi, có worker rẻ: **Render** có lợi.
- Nếu đã có tổ chức AWS và nhu cầu compliance/infra sâu: **AWS** hợp lý nhưng cần dùng calculator để chốt giá chính xác. citeturn4search0turn4search1turn4search3turn20search1turn21search0turn21search2

**Milestones triển khai**

```mermaid
gantt
  title Lộ trình triển khai Tarot Web App
  dateFormat  YYYY-MM-DD
  axisFormat  %d/%m

  section Discovery
  Chốt scope MVP, UX flow, data model          :a1, 2026-08-01, 7d

  section Foundation
  Scaffold monorepo, Docker, CI                :a2, after a1, 5d
  Migrations, seed, RLS baseline               :a3, after a2, 7d

  section Core Product
  Cards, decks, spreads APIs                   :a4, after a3, 7d
  Reading flow + draw engine                   :a5, after a4, 7d
  Reading history + profile                    :a6, after a5, 5d

  section AI and Billing
  AI interpretation queue + schema validation  :a7, after a6, 7d
  Billing schema + webhook plumbing            :a8, after a7, 6d

  section Admin and Quality
  Admin CRUD + audit logs                      :a9, after a8, 6d
  Unit/integration/E2E hardening               :a10, after a9, 7d

  section Release
  Observability, backups, runbooks             :a11, after a10, 4d
  Staging, load smoke, production release      :a12, after a11, 4d
```

**Bảng việc giao cho đội**

| Milestone | Đầu việc chính | Output |
|---|---|---|
| Foundation | repo, envs, Docker, CI | chạy local 1 lệnh |
| Data | schema, migrations, seed 78 cards | DB bootstrappable |
| API | endpoints decks/cards/spreads/readings | OpenAPI hoặc docs endpoint |
| Frontend | flow chọn spread → draw → result | UX hoàn chỉnh |
| Auth | sign in, refresh, profile | session ổn định |
| AI | queue, provider adapter, validation | interpretation JSON hợp lệ |
| Billing | checkout, webhook, subscription sync | idempotent billing flow |
| Admin | CRUD card/spread/media/license | hành lang nội dung |
| Ops | monitoring, backup, alerts, runbook | sẵn sàng production |

**Deployment checklist**

| Hạng mục | Bắt buộc trước go-live |
|---|---|
| ENV | tất cả secrets ở secret manager/CI secrets |
| DB | migration up/down test trên staging |
| RLS | test user A không thấy user B |
| Seed | deck mặc định đủ 78 lá |
| Search | index build thành công |
| AI | schema validation + retry + dead-letter |
| Billing | webhook signature verification + replay handling |
| Media | mỗi file có `license_record_id` |
| Backup | restore test ít nhất 1 lần |
| Observability | alert 5xx, queue stuck, webhook failure |
| Legal | `ATTRIBUTION.md`, privacy policy, terms |
| Performance | p95 đọc bài ở mức chấp nhận được trên mobile |
| Release | rollback plan và migrations rollback note |

**Khuyến nghị cuối cùng cho prompt giao việc**

Khi giao prompt này cho AI agent hoặc đội dev, hãy yêu cầu họ bàn giao theo thứ tự: **schema trước, seed tiếp theo, API sau, rồi UI và AI**, vì khi data model đã ổn định thì Supabase/PostgREST, Prisma Migrate, RLS, webhook idempotency và test contract đều dễ khóa chặt hơn. Data API của Supabase được sinh trực tiếp từ schema; Prisma Migrate nhắm tới việc đồng bộ schema theo thời gian; GitHub Actions và Docker giúp đóng gói pipeline lặp lại; PostgreSQL backup/restore nên được diễn tập sớm thay vì để tới sát ngày release. citeturn14search1turn14search4turn3search3turn3search11turn11search22turn22search6turn10search8turn10search0