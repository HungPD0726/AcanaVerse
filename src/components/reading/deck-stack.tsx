"use client";

import { CardsThreeIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";

interface DeckStackProps {
  cardBackSrc: string;
  onShuffle(): void;
  label: string;
  sublabel: string;
}

const topCardVariants = {
  idle: { y: 0, rotate: 0 },
  hover: { y: -10, rotate: -2 },
};

const middleCardVariants = {
  idle: { x: 4, y: 5, rotate: 1.5 },
  hover: { x: 9, y: 8, rotate: 3 },
};

export function DeckStack({
  cardBackSrc,
  onShuffle,
  label,
  sublabel,
}: DeckStackProps) {
  return (
    <motion.button
      type="button"
      onClick={onShuffle}
      initial="idle"
      animate="idle"
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      aria-label={label}
      className="group flex w-full flex-col items-center rounded-panel border border-line bg-soft/45 px-6 py-8 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span className="relative block h-52 w-36 sm:h-60 sm:w-40">
        <motion.span
          variants={middleCardVariants}
          className="absolute inset-0 overflow-hidden rounded-[0.5rem] border border-line bg-surface"
        >
          <Image
            src={cardBackSrc}
            alt=""
            fill
            loading="eager"
            sizes="160px"
            className="object-cover opacity-60"
          />
        </motion.span>
        <span className="absolute inset-0 translate-x-2 translate-y-2 overflow-hidden rounded-[0.5rem] border border-line bg-surface opacity-70">
          <Image
            src={cardBackSrc}
            alt=""
            fill
            loading="eager"
            sizes="160px"
            className="object-cover"
          />
        </span>
        <motion.span
          variants={topCardVariants}
          className="absolute inset-0 overflow-hidden rounded-[0.5rem] border border-line bg-surface"
        >
          <Image
            src={cardBackSrc}
            alt=""
            fill
            loading="eager"
            sizes="160px"
            className="object-cover"
          />
        </motion.span>
      </span>

      <span className="mt-7 font-editorial text-2xl font-medium text-ink">
        {label}
      </span>
      <span className="mt-2 max-w-xs text-xs leading-5 text-muted">
        {sublabel}
      </span>
      <span className="mt-6 inline-flex items-center gap-2 rounded-control bg-ink px-4 py-2.5 text-xs font-semibold text-canvas transition-transform group-hover:-translate-y-0.5">
        <CardsThreeIcon size={17} weight="bold" aria-hidden />
        {label}
      </span>
    </motion.button>
  );
}
