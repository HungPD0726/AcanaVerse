"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ShuffleAnimationProps {
  cardBackSrc: string;
  onReady: () => void;
  readyLabel: string;
  shufflingLabel: string;
}

/* 18 cards flying in random burst directions */
const CARD_COUNT = 18;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface FlyCard {
  id: number;
  x: number;
  y: number;
  rotate: number;
  duration: number;
  delay: number;
}

export function ShuffleAnimation({
  cardBackSrc,
  onReady,
  readyLabel,
  shufflingLabel,
}: ShuffleAnimationProps) {
  const [cards, setCards] = useState<FlyCard[]>([]);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const generated: FlyCard[] = Array.from({ length: CARD_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(-320, 320),
      y: randomBetween(-260, 260),
      rotate: randomBetween(-180, 180),
      duration: randomBetween(0.7, 1.2),
      delay: randomBetween(0, 0.25),
    }));
    setCards(generated);

    const t = setTimeout(() => setSettled(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Explosion arena */}
      <div className="relative flex h-64 w-full max-w-xl items-center justify-center sm:h-80">
        {/* centre deck */}
        <div className="relative z-10 h-48 w-32 overflow-hidden rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_#000] sm:h-56 sm:w-36">
          <Image src={cardBackSrc} alt="" fill sizes="150px" className="object-cover" priority />
        </div>

        {/* flying cards */}
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="pointer-events-none absolute h-28 w-18 overflow-hidden rounded-lg border border-black/40 shadow-lg sm:h-36 sm:w-22"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
            animate={
              settled
                ? { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.6 }
                : { x: card.x, y: card.y, rotate: card.rotate, opacity: 0.85, scale: 0.85 }
            }
            transition={{
              duration: card.duration,
              delay: card.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image src={cardBackSrc} alt="" fill sizes="90px" className="object-cover" />
          </motion.div>
        ))}
      </div>

      {/* Label */}
      <motion.p
        className="font-editorial text-2xl text-ink sm:text-3xl"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: settled ? 0 : Infinity }}
      >
        {settled ? "✨" : "🔀"} {settled ? readyLabel : shufflingLabel}
      </motion.p>

      {/* Choose button - fades in when settled */}
      <motion.button
        type="button"
        onClick={onReady}
        className="moonlight-button inline-flex min-h-14 items-center gap-3 rounded-full bg-black px-8 text-sm font-bold text-white"
        initial={{ opacity: 0, y: 16 }}
        animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
        disabled={!settled}
      >
        <span className="text-lg">🃏</span>
        {readyLabel}
      </motion.button>
    </div>
  );
}
