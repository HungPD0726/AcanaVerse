"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/domain/tarot";

/* ─── timeline data ─────────────────────────────────────────── */
const timeline = [
  {
    year: "1400s",
    era: { vi: "Khởi Nguyên", en: "Origins" },
    title: {
      vi: "Những Lá Bài Đầu Tiên Ở Bắc Ý",
      en: "The First Cards in Northern Italy",
    },
    body: {
      vi: "Tarot ra đời như một trò chơi trí tuệ của giới quý tộc Bắc Ý, ban đầu được gọi là trionfi (bài chiến thắng). Bộ bài Visconti-Sforza được tạo ra vào khoảng 1450 là một trong những bộ bài Tarot cổ nhất còn tồn tại đến ngày nay.",
      en: "Tarot began as an intellectual card game of Italian nobility, originally called trionfi (triumph cards). The Visconti-Sforza deck, created around 1450, is one of the oldest surviving Tarot decks.",
    },
    card: "/images/cards/the-world.webp",
    color: "#f3c498",
  },
  {
    year: "1700s",
    era: { vi: "Huyền Học", en: "Esoteric Shift" },
    title: {
      vi: "Bài Tarot Gặp Huyền Học Châu Âu",
      en: "Tarot Meets Western Esotericism",
    },
    body: {
      vi: "Vào thế kỷ XVIII, các nhà chiêm tinh học và nhà thần bí học người Pháp, đặc biệt là Antoine Court de Gébelin, bắt đầu khai thác các lá bài như công cụ tiên tri và kết nối chúng với Kabbalah, chiêm tinh học và giải tích số.",
      en: "In the 18th century, French occultists — notably Antoine Court de Gébelin — began interpreting the cards as prophetic tools and linking them to Kabbalah, astrology and numerology.",
    },
    card: "/images/cards/the-high-priestess.webp",
    color: "#d8c6ff",
  },
  {
    year: "1909",
    era: { vi: "Rider-Waite", en: "Rider-Waite" },
    title: {
      vi: "Bộ Bài Rider-Waite-Smith Kinh Điển Ra Đời",
      en: "The Iconic Rider-Waite-Smith Deck Is Born",
    },
    body: {
      vi: "Arthur Edward Waite và họa sĩ Pamela Colman Smith — thành viên của Hermetic Order of the Golden Dawn — tạo ra bộ bài Tarot Rider-Waite năm 1909. Đây là bộ bài đầu tiên minh họa đầy đủ tất cả 78 lá với hình ảnh kể chuyện phong phú, và trở thành nền tảng cho hầu hết các bộ bài hiện đại.",
      en: "Arthur Edward Waite and artist Pamela Colman Smith — members of the Hermetic Order of the Golden Dawn — created the Rider-Waite deck in 1909. The first deck to fully illustrate all 78 cards with narrative scenes, it became the template for nearly every modern Tarot deck.",
    },
    card: "/images/cards/the-magician.webp",
    color: "#a5d8e6",
  },
  {
    year: "1970s",
    era: { vi: "Đại Chúng Hóa", en: "Mainstream Awakening" },
    title: {
      vi: "Tarot Trở Thành Văn Hóa Đại Chúng",
      en: "Tarot Enters Mainstream Culture",
    },
    body: {
      vi: "Phong trào New Age của những năm 1970 đưa Tarot vào tầm tay của hàng triệu người trên toàn thế giới. Tarot không còn là công cụ bí truyền mà trở thành phương tiện tự khám phá và chữa lành cảm xúc được hàng triệu người tin dùng.",
      en: "The New Age movement of the 1970s brought Tarot to millions worldwide. No longer purely esoteric, it became a tool for self-reflection, emotional healing and personal development.",
    },
    card: "/images/cards/the-sun.webp",
    color: "#f9f4a8",
  },
  {
    year: "Hiện Nay",
    era: { vi: "Kỷ Nguyên Số", en: "Digital Era" },
    title: {
      vi: "Tarot Trong Thời Đại Kỹ Thuật Số",
      en: "Tarot in the Digital Age",
    },
    body: {
      vi: "Ngày nay, hàng triệu người dùng Tarot như một gương phản chiếu nội tâm — không phải để biết trước tương lai mà để hiểu rõ bản thân hơn. ArcanaVerse mang Tarot vào thế kỷ 21 với công nghệ AI, song ngữ và trải nghiệm số hoàn toàn mới.",
      en: "Today, millions use Tarot as a mirror for introspection — not to predict the future but to understand themselves more deeply. ArcanaVerse brings Tarot into the 21st century with AI, bilingual support and a fully immersive digital experience.",
    },
    card: "/images/cards/the-star.webp",
    color: "#b8f0c8",
  },
];

const purposes = [
  {
    icon: "🪞",
    title: { vi: "Phản Chiếu Nội Tâm", en: "Inner Reflection" },
    body: {
      vi: "Tarot không thể 'đọc tương lai' theo nghĩa đen. Thay vào đó, nó là chiếc gương giúp bạn nhìn rõ hơn những suy nghĩ, cảm xúc và mong muốn sâu xa nhất của mình.",
      en: "Tarot doesn't literally 'read the future'. Instead, it's a mirror that helps you see your thoughts, emotions and deepest desires more clearly.",
    },
  },
  {
    icon: "🧩",
    title: { vi: "Ngôn Ngữ Biểu Tượng", en: "The Language of Symbols" },
    body: {
      vi: "78 lá bài mang 78 biểu tượng nguyên mẫu phổ quát — các hình mẫu tâm lý mà Carl Jung gọi là archetypes — kết nối với tiềm thức sâu thẳm của con người vượt qua ngôn ngữ và văn hóa.",
      en: "78 cards carry 78 universal archetypal symbols — the psychological patterns Carl Jung called archetypes — that connect with the deepest layers of the human unconscious across language and culture.",
    },
  },
  {
    icon: "🌙",
    title: { vi: "Hướng Dẫn Quyết Định", en: "Decision Guidance" },
    body: {
      vi: "Trải bài Tarot như một cuộc đối thoại suy nghĩ với chính mình. Các lá bài đặt ra những câu hỏi bạn chưa nghĩ đến, giúp bạn nhìn một tình huống từ nhiều góc độ khác nhau trước khi đưa ra quyết định.",
      en: "A Tarot spread is like a structured dialogue with yourself. The cards surface questions you haven't considered yet, helping you view a situation from multiple perspectives before making a decision.",
    },
  },
  {
    icon: "✨",
    title: { vi: "Thực Hành Chánh Niệm", en: "Mindfulness Practice" },
    body: {
      vi: "Nghi thức bốc bài hàng ngày — dừng lại, thở sâu, rút một lá và suy nghĩ về ý nghĩa của nó — là một hình thức thiền định nhẹ nhàng giúp cân bằng tâm trí và nuôi dưỡng trực giác.",
      en: "The daily ritual of pulling a card — pausing, breathing, drawing one card and meditating on its meaning — is a gentle mindfulness practice that balances the mind and nurtures intuition.",
    },
  },
];

/* ─── animated section header ───────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── floating card ─────────────────────────────────────────── */
function FloatingCard({ src, alt, delay = 0 }: { src: string; alt: string; delay?: number }) {
  return (
    <motion.div
      className="relative h-40 w-24 overflow-hidden rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] sm:h-52 sm:w-32"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: [0, -12, 0], opacity: 1 }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration: 0.6, delay },
      }}
    >
      <Image src={src} alt={alt} fill sizes="140px" className="object-cover" />
    </motion.div>
  );
}

/* ─── timeline item ─────────────────────────────────────────── */
function TimelineItem({
  item,
  index,
  locale,
}: {
  item: (typeof timeline)[0];
  index: number;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`relative grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${isEven ? "" : "lg:[direction:rtl]"}`}
    >
      {/* Card image side */}
      <div className={`flex justify-center ${isEven ? "" : "lg:[direction:ltr]"}`}>
        <div
          className="relative group cursor-default"
          style={{ perspective: "800px" }}
        >
          <motion.div
            whileHover={{ rotateY: 12, rotateX: -6, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative h-72 w-48 overflow-hidden rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_#000]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image src={item.card} alt={item.title[locale]} fill sizes="200px" className="object-cover" />
            {/* Overlay badge */}
            <div className="absolute bottom-3 left-3 right-3 rounded-xl border-2 border-black px-3 py-2 text-center text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]" style={{ background: item.color }}>
              {item.year}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Text side */}
      <div className={`${isEven ? "" : "lg:[direction:ltr]"}`}>
        <span
          className="inline-block rounded-full border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]"
          style={{ background: item.color }}
        >
          {item.era[locale]}
        </span>
        <h3 className="mt-4 font-editorial text-3xl leading-tight text-ink sm:text-4xl">
          {item.title[locale]}
        </h3>
        <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
          {item.body[locale]}
        </p>
      </div>

      {/* Connector line dot */}
      <div className="absolute left-1/2 top-1/2 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-black lg:block" />
    </motion.div>
  );
}

/* ─── purpose card ───────────────────────────────────────────── */
function PurposeCard({
  item,
  locale,
  index,
}: {
  item: (typeof purposes)[0];
  locale: Locale;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="moonlight-shadow flex flex-col gap-4 rounded-[1.5rem] bg-surface p-6 sm:p-8"
    >
      <span className="text-4xl">{item.icon}</span>
      <h3 className="font-editorial text-2xl text-ink">{item.title[locale]}</h3>
      <p className="text-sm leading-6 text-muted">{item.body[locale]}</p>
    </motion.div>
  );
}

/* ─── main page component ────────────────────────────────────── */
export default function TarotAboutPage() {
  const locale = useLocale() as Locale;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-moonlight-grid relative overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[92vh] items-center justify-center overflow-hidden border-b-2 border-black bg-[#0a0c12] text-white"
      >
        {/* Parallax stars bg */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ y: heroY }}
        >
          {Array.from({ length: 90 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </motion.div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6"
          style={{ opacity: heroOpacity }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block rounded-full border-2 border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm"
          >
            {locale === "vi" ? "Tarot 101 • Lịch Sử & Ý Nghĩa" : "Tarot 101 • History & Purpose"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 font-editorial text-6xl font-normal leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {locale === "vi" ? (
              <>
                Tarot là gì?<br />
                <span className="text-[#d4af37]">Và tại sao</span> nó<br />
                tồn tại hàng thế kỷ?
              </>
            ) : (
              <>
                What is Tarot?<br />
                <span className="text-[#d4af37]">And why</span> has it<br />
                endured for centuries?
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg"
          >
            {locale === "vi"
              ? "Từ những lá bài giải trí ở Bắc Ý thế kỷ XV đến công cụ khám phá tâm lý hiện đại — hành trình 600 năm của Tarot là câu chuyện về con người, biểu tượng và trí tuệ nội tâm."
              : "From leisure cards in 15th-century Northern Italy to a modern psychological exploration tool — Tarot's 600-year journey is a story of humanity, symbolism and inner wisdom."}
          </motion.p>

          {/* Floating cards hero display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-12 flex items-end justify-center gap-3 sm:gap-6"
          >
            <FloatingCard src="/images/cards/the-moon.webp" alt="The Moon" delay={0.6} />
            <FloatingCard src="/images/cards/wheel-of-fortune.webp" alt="Wheel of Fortune" delay={0} />
            <FloatingCard src="/images/cards/the-star.webp" alt="The Star" delay={1.2} />
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-xs text-white/40 uppercase tracking-widest">
              {locale === "vi" ? "Cuộn xuống" : "Scroll down"}
            </span>
            <motion.div
              className="h-10 w-px bg-white/20"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── What is Tarot intro ────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionLabel>
          <span className="rounded-full border-2 border-black bg-amber-200 px-3 py-1 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_0px_#000]">
            {locale === "vi" ? "Giới thiệu" : "Introduction"}
          </span>
        </SectionLabel>
        <motion.h2
          className="mt-6 font-editorial text-4xl leading-tight text-ink sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          {locale === "vi"
            ? "78 lá bài. Vô số câu chuyện."
            : "78 cards. Infinite stories."}
        </motion.h2>
        <motion.div
          className="mt-8 space-y-5 text-base leading-8 text-muted sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p>
            {locale === "vi"
              ? "Một bộ Tarot gồm 78 lá bài được chia thành hai phần: 22 lá Đại Ẩn Số (Major Arcana) đại diện cho những lực lượng và bài học lớn của cuộc đời — như Kẻ Khờ (The Fool), Nữ Tư Tế (The High Priestess) hay Bánh Xe Vận Mệnh (Wheel of Fortune); và 56 lá Tiểu Ẩn Số (Minor Arcana) chia thành 4 chất bài phản ánh những trải nghiệm hàng ngày của chúng ta."
              : "A Tarot deck contains 78 cards split into two sections: 22 Major Arcana representing the great forces and lessons of life — such as The Fool, The High Priestess or the Wheel of Fortune; and 56 Minor Arcana divided into 4 suits reflecting our everyday experiences."}
          </p>
          <p>
            {locale === "vi"
              ? "Mỗi lá bài mang một hình ảnh ẩn dụ phong phú — được cẩn thận xây dựng từ thần thoại học, chiêm tinh học, Kabbalah và tâm lý học Jungian — tạo nên một ngôn ngữ biểu tượng phổ quát vượt qua biên giới văn hóa."
              : "Each card carries a rich metaphorical image — carefully crafted from mythology, astrology, Kabbalah and Jungian psychology — forming a universal symbolic language that transcends cultural boundaries."}
          </p>
        </motion.div>

        {/* Arcana showcase inline */}
        <motion.div
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {[
            { src: "/images/cards/the-fool.webp", label: locale === "vi" ? "I. Kẻ Khờ" : "0. The Fool" },
            { src: "/images/cards/the-magician.webp", label: locale === "vi" ? "II. Pháp Sư" : "I. The Magician" },
            { src: "/images/cards/the-high-priestess.webp", label: locale === "vi" ? "III. Nữ Tư Tế" : "II. High Priestess" },
            { src: "/images/cards/the-world.webp", label: locale === "vi" ? "XXI. Thế Giới" : "XXI. The World" },
          ].map((c, i) => (
            <motion.div
              key={c.src}
              className="group relative overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000]"
              whileHover={{ y: -6, rotate: [-1, 1][i % 2], scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ transitionDelay: `${i * 0.08}s` } as React.CSSProperties}
            >
              <div className="relative aspect-[2/3.2] w-full">
                <Image src={c.src} alt={c.label} fill sizes="180px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="border-t-2 border-black bg-surface px-2 py-1.5 text-center text-xs font-bold text-ink">
                {c.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y-2 border-black bg-canvas py-24">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-black/20 lg:block" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>
            <span className="rounded-full border-2 border-black bg-[#d8c6ff] px-3 py-1 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_0px_#000]">
              {locale === "vi" ? "Lịch Sử" : "History"}
            </span>
          </SectionLabel>
          <motion.h2
            className="mt-5 font-editorial text-4xl leading-tight text-ink sm:text-5xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {locale === "vi" ? "Hành Trình 600 Năm Của Tarot" : "600 Years of Tarot History"}
          </motion.h2>

          <div className="mt-16 flex flex-col gap-24">
            {timeline.map((item, index) => (
              <TimelineItem key={item.year} item={item} index={index} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Purpose ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionLabel>
          <span className="rounded-full border-2 border-black bg-[#b8f0c8] px-3 py-1 text-xs font-bold uppercase text-black shadow-[2px_2px_0px_0px_#000]">
            {locale === "vi" ? "Mục Đích" : "Purpose"}
          </span>
        </SectionLabel>
        <motion.h2
          className="mt-5 font-editorial text-4xl leading-tight text-ink sm:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {locale === "vi" ? "Tại Sao Người Ta Dùng Tarot?" : "Why Do People Use Tarot?"}
        </motion.h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {purposes.map((item, i) => (
            <PurposeCard key={i} item={item} locale={locale} index={i} />
          ))}
        </div>
      </section>

      {/* ── 78-card section ────────────────────────────────────── */}
      <section className="overflow-hidden border-y-2 border-black bg-[#0a0c12] py-24 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel>
            <span className="rounded-full border-2 border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70">
              {locale === "vi" ? "78 Lá Bài" : "78 Cards"}
            </span>
          </SectionLabel>
          <motion.h2
            className="mt-6 font-editorial text-4xl text-white sm:text-5xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {locale === "vi" ? "Cấu Trúc Của Một Bộ Tarot" : "The Anatomy of a Tarot Deck"}
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {locale === "vi"
              ? "Bộ bài Tarot chuẩn gồm 78 lá chia đều thành hai phần lớn — Đại Ẩn Số và Tiểu Ẩn Số — mỗi phần phản chiếu một tầng khác nhau của trải nghiệm con người."
              : "A standard Tarot deck has 78 cards split into two major sections — Major and Minor Arcana — each reflecting a different layer of human experience."}
          </motion.p>

          {/* Arcana split diagram */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                num: "22",
                title: { vi: "Đại Ẩn Số", en: "Major Arcana" },
                subtitle: { vi: "Lực Lượng Vũ Trụ & Bài Học Lớn", en: "Universal Forces & Life Lessons" },
                color: "#d4af37",
                examples: { vi: ["Kẻ Khờ", "Nữ Hoàng", "Bánh Xe Vận Mệnh", "Ngôi Sao", "Thế Giới"], en: ["The Fool", "The Empress", "Wheel of Fortune", "The Star", "The World"] },
              },
              {
                num: "56",
                title: { vi: "Tiểu Ẩn Số", en: "Minor Arcana" },
                subtitle: { vi: "4 Chất Bài · Trải Nghiệm Hàng Ngày", en: "4 Suits · Everyday Experiences" },
                color: "#7eb0d5",
                examples: { vi: ["Wands — Ý Chí", "Cups — Cảm Xúc", "Swords — Trí Tuệ", "Pentacles — Vật Chất"], en: ["Wands — Will", "Cups — Emotions", "Swords — Intellect", "Pentacles — Material"] },
              },
            ].map((block, i) => (
              <motion.div
                key={i}
                className="moonlight-shadow rounded-[1.5rem] border-2 border-white/20 bg-white/5 p-8 text-left backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="font-editorial text-7xl font-bold" style={{ color: block.color }}>
                  {block.num}
                </span>
                <h3 className="mt-2 font-editorial text-2xl text-white">{block.title[locale]}</h3>
                <p className="mt-1 text-xs text-white/50">{block.subtitle[locale]}</p>
                <ul className="mt-4 space-y-1">
                  {block.examples[locale].map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="h-1 w-1 rounded-full bg-white/40" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-[#e2c6ff] py-24 text-black">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.h2
            className="font-editorial text-5xl leading-tight text-black sm:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {locale === "vi" ? "Sẵn Sàng Rút Bài Đầu Tiên?" : "Ready to Draw Your First Card?"}
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 max-w-lg text-sm leading-7 text-black/70 sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {locale === "vi"
              ? "Trải nghiệm lần đọc bài Tarot đầu tiên của bạn — không phán xét, không mê tín, chỉ là một cuộc trò chuyện sâu sắc với chính mình."
              : "Experience your first Tarot reading — no judgement, no superstition, just a meaningful conversation with yourself."}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/reading/daily-insight"
              className="moonlight-button inline-flex min-h-14 items-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white"
            >
              {locale === "vi" ? "✨ Bắt Đầu Ngay" : "✨ Start Now"}
            </Link>
            <Link
              href="/decks"
              className="moonlight-button inline-flex min-h-14 items-center gap-2 rounded-full bg-surface px-8 text-sm font-bold text-black"
            >
              {locale === "vi" ? "🃏 Khám Phá 78 Lá Bài" : "🃏 Explore 78 Cards"}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
