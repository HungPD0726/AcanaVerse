// @vitest-environment node

import { describe, expect, it } from "vitest";
import { randomOrientation, shuffle } from "@/lib/random";

function sequenceRandom(values: number[]) {
  let index = 0;
  return {
    nextUint32() {
      return values[index++ % values.length];
    },
  };
}

describe("secure reading helpers", () => {
  it("performs a non-mutating Fisher-Yates shuffle", () => {
    const original = ["a", "b", "c", "d", "e"];
    const shuffled = shuffle(
      original,
      sequenceRandom([1, 3, 2, 7]),
    );
    expect(original).toEqual(["a", "b", "c", "d", "e"]);
    expect(shuffled).toHaveLength(original.length);
    expect(new Set(shuffled)).toEqual(new Set(original));
    expect(shuffled).not.toEqual(original);
  });

  it("maps the lower and upper half to stable orientations", () => {
    expect(randomOrientation(sequenceRandom([0]))).toBe("upright");
    expect(randomOrientation(sequenceRandom([2]))).toBe("upright");
    expect(randomOrientation(sequenceRandom([1]))).toBe("reversed");
    expect(randomOrientation(sequenceRandom([3]))).toBe("reversed");
  });
});
