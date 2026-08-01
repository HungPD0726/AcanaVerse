"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ShuffleAnimationProps {
  cardBackSrc: string;
  onReady(): void;
  readyLabel: string;
  shufflingLabel: string;
  hint: string;
}

const packetCards = Array.from({ length: 8 }, (_, index) => index);

export function ShuffleAnimation({
  cardBackSrc,
  onReady,
  readyLabel,
  shufflingLabel,
  hint,
}: ShuffleAnimationProps) {
  const reduceMotion = useReducedMotion();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setSettled(true),
      reduceMotion ? 200 : 1_650,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <section
      className="mx-auto flex min-h-[34rem] max-w-3xl flex-col items-center justify-center text-center"
      aria-labelledby="shuffle-title"
    >
      <div
        className="relative h-64 w-full max-w-md"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 h-56 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[0.6rem] border border-line bg-soft" />
        {packetCards.map((index) => {
          const isLeft = index % 2 === 0;
          const order = Math.floor(index / 2);
          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2 h-48 w-32 overflow-hidden rounded-[0.5rem] border border-line bg-surface"
              initial={{
                x: isLeft ? -78 : -50,
                y: -96 + order * 2,
                rotate: isLeft ? -8 : 8,
              }}
              animate={
                settled
                  ? { x: -64, y: -102 + order, rotate: 0 }
                  : {
                      x: isLeft
                        ? [-78, -96, -64]
                        : [-50, -31, -64],
                      y: [-96 + order * 2, -103, -102 + order],
                      rotate: isLeft ? [-8, -10, 0] : [8, 10, 0],
                    }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.9,
                delay: reduceMotion ? 0 : order * 0.13,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src={cardBackSrc}
                alt=""
                fill
                loading="eager"
                sizes="128px"
                className="object-cover"
              />
            </motion.div>
          );
        })}
      </div>

      <h2
        id="shuffle-title"
        className="font-editorial text-4xl font-medium text-ink sm:text-5xl"
      >
        {settled ? readyLabel : shufflingLabel}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted">{hint}</p>

      <motion.button
        type="button"
        onClick={onReady}
        disabled={!settled}
        initial={{ opacity: 0, y: 8 }}
        animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-control bg-ink px-5 text-sm font-semibold text-canvas focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none"
      >
        {readyLabel}
        <ArrowRightIcon size={17} weight="bold" aria-hidden />
      </motion.button>
      <span className="sr-only" role="status" aria-live="polite">
        {settled ? readyLabel : shufflingLabel}
      </span>
    </section>
  );
}
