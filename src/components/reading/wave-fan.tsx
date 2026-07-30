"use client";

import { motion, useSpring } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface WaveFanProps {
  shuffledCardIds: string[];
  selectedCardIds: Set<string>;
  onSelect: (cardId: string) => void;
  cardBackSrc?: string;
  /** Sigma of the Gaussian bell curve (in card-index units). Higher = wider wave. */
  sigma?: number;
  /** Max lift height in px for the directly-hovered card */
  maxLift?: number;
}

function WaveFanCard({
  cardId,
  index,
  hoveredIdx,
  isSelected,
  onSelect,
  cardBackSrc,
  sigma,
  maxLift,
}: {
  cardId: string;
  index: number;
  hoveredIdx: number | null;
  isSelected: boolean;
  onSelect: (id: string) => void;
  cardBackSrc: string;
  sigma: number;
  maxLift: number;
}) {
  const springY = useSpring(0, { stiffness: 280, damping: 22 });

  useEffect(() => {
    if (isSelected || hoveredIdx === null) {
      springY.set(0);
      return;
    }
    const d = index - hoveredIdx;
    const lift = maxLift * Math.exp(-(d * d) / (2 * sigma * sigma));
    springY.set(-lift);
  }, [hoveredIdx, index, isSelected, maxLift, sigma, springY]);

  return (
    <motion.button
      type="button"
      disabled={isSelected}
      onClick={() => !isSelected && onSelect(cardId)}
      aria-pressed={isSelected}
      aria-label={`Card ${index + 1}`}
      style={{
        y: isSelected ? 28 : springY,
        zIndex: isSelected ? 0 : index,
        opacity: isSelected ? 0.22 : 1,
        flexShrink: 0,
      }}
      whileTap={!isSelected ? { scale: 0.9, y: 8 } : undefined}
      className="relative h-28 w-12 cursor-pointer overflow-hidden rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-opacity focus-visible:z-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default sm:h-36 sm:w-[3.6rem]"
    >
      <Image
        src={cardBackSrc}
        alt=""
        fill
        sizes="60px"
        className="pointer-events-none object-cover"
      />
    </motion.button>
  );
}

export function WaveFan({
  shuffledCardIds,
  selectedCardIds,
  onSelect,
  cardBackSrc = "/images/brand/card-back.webp",
  sigma = 2.8,
  maxLift = 64,
}: WaveFanProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const row = rowRef.current;
      if (!row) return;
      const rect = row.getBoundingClientRect();
      const relX = e.clientX - rect.left + row.scrollLeft;
      const cardW = rect.width / shuffledCardIds.length;
      const idx = Math.floor(relX / cardW);
      setHoveredIdx(idx >= 0 && idx < shuffledCardIds.length ? idx : null);
    },
    [shuffledCardIds.length],
  );

  const onMouseLeave = useCallback(() => {
    setHoveredIdx(null);
  }, []);

  return (
    <div
      ref={rowRef}
      className="flex w-full items-end gap-0.5 overflow-x-auto px-2 py-10 sm:px-4"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-testid="card-fan"
    >
      {shuffledCardIds.map((cardId, idx) => (
        <WaveFanCard
          key={cardId}
          cardId={cardId}
          index={idx}
          hoveredIdx={hoveredIdx}
          isSelected={selectedCardIds.has(cardId)}
          onSelect={onSelect}
          cardBackSrc={cardBackSrc}
          sigma={sigma}
          maxLift={maxLift}
        />
      ))}
    </div>
  );
}
