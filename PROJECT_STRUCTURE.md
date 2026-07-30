# 📁 ArcanaVerse — Structure & Architecture Documentation

Tài liệu chi tiết về **Cấu trúc Thư mục (Project Structure)**, kiến trúc phân tầng (Clean Architecture), quy chuẩn đặt tên và đề xuất tối ưu hóa cho dự án **ArcanaVerse**.

---

## 📐 1. Tổng Quan Kiến Trúc (Architecture Overview)

Dự án tuân theo mô hình **Modular Domain-Driven Feature Folder** kết hợp với quy chuẩn **Next.js 16 App Router**:

```
ArcanaVerse/
├── .agents/                 # Quy chuẩn Agent rules & custom AI skills (Skills directory)
├── messages/                # Tập tin bản dịch đa ngôn ngữ i18n (en.json, vi.json)
├── public/                  # Tài nguyên tĩnh public (Hình ảnh thẻ bài Tarot & thương hiệu)
│   └── images/
│       ├── brand/           # Hình nền, card back thương hiệu (Celestial, Moonlight, Classic)
│       └── cards/           # 78 lá bài Rider-Waite-Smith chuẩn WebP + license manifest
├── scripts/                 # Scripts tự động hóa (Tải & tối ưu tài nguyên bài)
├── src/                     # Nguồn mã chính của ứng dụng
│   ├── app/                 # Next.js 16 App Router Routes (Trang & bố cục)
│   ├── components/          # React Components phân nhóm theo tính năng (Feature Modules)
│   ├── data/                # Dữ liệu tĩnh (Danh mục lá bài, bộ bài, sơ đồ quẻ)
│   ├── domain/              # Đăng ký kiểu dữ liệu cốt lõi (Domain Types & Interfaces)
│   ├── i18n/                # Cấu hình next-intl & routing đa ngôn ngữ (vi/en)
│   └── lib/                 # Engines xử lý logic (Web Audio, AI Reading Engine, Local Storage)
└── tests / configs          # Cấu hình Vitest, Playwright, Tailwind v4, TypeScript
```

---

## 🗂️ 2. Chi Tiết Các Thư Mục (Detailed Breakdown)

### 🟢 `src/app/` — Route Pages (Next.js 16 App Router)
Quản lý định tuyến đa ngôn ngữ song ngữ `/vi` và `/en`:
- `[locale]/layout.tsx`: Root Layout bao bọc Provider, SiteHeader, SiteFooter, Font Cormorant Garamond.
- `[locale]/page.tsx`: Trang chủ (Home Page) giao diện Moonlight World (Hero, Spreads, Journey, Storytelling).
- `[locale]/reading/[spreadSlug]/page.tsx`: Trang trải bài trực tiếp (Daily insight, 3-card spread, Celtic cross...).
- `[locale]/decks/page.tsx`: Thư viện bài Tarot kỹ thuật số (3D Fanning Deck Cards & Grid 78 lá).
- `[locale]/about/page.tsx`: Trang 600 năm Lịch sử & Ý nghĩa Tarot với Parallax Stars.
- `[locale]/credits/page.tsx`: Trang bản quyền & nguồn gốc tài nguyên hình ảnh.
- `[locale]/login/page.tsx`: Trang đăng nhập demo.

### 🔷 `src/components/` — Modular Feature Components
Các components được chia nhóm rõ ràng theo từng miền tính năng:
- **`components/reading/`**: Bộ công cụ phục vụ trải bài:
  - `reading-experience.tsx`: Trình điều khiển luồng trải bài 5 bước.
  - `question-prompt-step.tsx`: Đặt câu hỏi & chọn chủ đề kèm quầng sáng tím.
  - `deck-stack.tsx`: Xấp bài 3D nghiêng theo chuột.
  - `shuffle-animation.tsx`: Hiệu ứng tráo bài 3D đứng.
  - `wave-fan.tsx`: Hàng bài 78 lá nhô cao dạng sóng nước.
  - `spread-tableau.tsx`: Sơ đồ xếp bài quẻ & thẻ vị trí.
  - `tarot-card-slot.tsx`: Ô lá bài với hiệu ứng lật 3D & ánh sáng shimmer.
  - `interpretation-panel.tsx`: Bảng luận giải AI & ý nghĩa truyền thống.
  - `export-reading-card.tsx`: Xuất thẻ tóm tắt quẻ bài dạng ảnh PNG.
- **`components/decks/`**: Bộ công cụ thư viện bài:
  - `deck-explorer.tsx`: Quản lý 3 bộ bài & switch chế độ xem.
  - `fanning-deck-card.tsx`: Thẻ bộ bài 3D xòe bài hình quạt khi rê chuột.
- **`components/home/`**: Components trang chủ (`daily-card-widget.tsx`).
- **`components/journal/`**: Nhật ký bốc bài (`journal-drawer.tsx`).
- **`components/navigation/`**: Thanh điều hướng dọc (`app-sidebar.tsx`).
- **`components/ui/`**: UI Primitives (`magic-particles.tsx`, `marquee-ticker.tsx`).
- **`components/providers/`**: Context Providers (`app-providers.tsx`, `auth-provider.tsx`, `theme-provider.tsx`).

### 🟡 `src/lib/` — Business Engines & Helper Utilities
- `audio-engine.ts`: Web Audio API Synthesizer (Tiếng tráo bài, lật bài, thả bài, chuông Tây Tạng 432Hz).
- `ai-reading-engine.ts`: Động cơ luận giải AI chuyên sâu song ngữ.
- `reading-engine.ts`: Động cơ xáo bài, quản lý state và lưu `sessionStorage`.
- `journal-storage.ts`: Quản lý lưu trữ nhật ký quẻ bài vào `localStorage`.

### 🟣 `src/data/` & `src/domain/`
- `domain/tarot.ts`: Định nghĩa kiểu dữ liệu `TarotCard`, `TarotDeck`, `SpreadDefinition`, `ReadingSession`.
- `data/cards.ts`: Dữ liệu 78 lá bài với hình ảnh, ý nghĩa Xuôi/Ngược (VI/EN).
- `data/decks.ts`: Định nghĩa 3 bộ bài (Classic Rider-Waite, Celestial Starlight, Ethereal Moonlight).
- `data/spreads.ts`: Định nghĩa các sơ đồ quẻ bài (Daily Insight, 3-Card Past-Present-Future, Celtic Cross...).

---

## ⚡ 3. Đánh Giá & Đề Xuất Tối Ưu Cấu Trúc (Refactoring Assessment)

Cấu trúc hiện tại của dự án đã rất sạch sẽ, tuân thủ chặt chẽ **Next.js App Router Best Practices**. Tuy nhiên, để dự án hoàn hảo hơn nữa, dưới đây là **1 cải tiến nhỏ** nên thực hiện:

### 🎯 Đề Xuất Tinh Chỉnh:
1. **Gom nhóm nhóm tính năng Auth/Login**:
   - Hiện tại `demo-login-form.tsx` và `demo-login-form.test.tsx` đang nằm trực tiếp ở góc ngoài `src/components/`.
   - **Tối ưu**: Di chuyển 2 file này vào thư mục `src/components/auth/` (tạo mới) để toàn bộ thư mục `src/components/` chỉ chứa các folder tính năng sạch sẽ.

---

## 🚀 4. Lệnh Kiểm Thử & Kiểm Tra Codebase

```bash
# Kiểm tra Type System TypeScript
npm run typecheck

# Chạy Unit Test Suite (Vitest)
npm test

# Chạy End-to-End Test (Playwright)
npm run test:e2e

# Biên dịch Production Build
npm run build
```
