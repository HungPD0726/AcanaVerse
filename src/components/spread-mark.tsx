import type { SpreadDefinition } from "@/domain/tarot";

export function SpreadMark({
  spread,
  compact = false,
}: {
  spread: SpreadDefinition;
  compact?: boolean;
}) {
  const columns =
    spread.cardCount === 1
      ? "grid-cols-1"
      : spread.cardCount === 3
        ? "grid-cols-3"
        : "grid-cols-5";

  return (
    <div
      aria-hidden
      className={`grid ${columns} items-end gap-1.5`}
    >
      {spread.positions.map((position) => (
        <span
          key={position.key}
          className={`block border border-current bg-transparent ${
            compact ? "h-7 w-4" : "h-10 w-6"
          }`}
          style={{
            transform: `rotate(${position.angle ?? (position.order % 2 ? -2 : 2)}deg)`,
          }}
        />
      ))}
    </div>
  );
}
