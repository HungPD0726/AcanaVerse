export interface RandomSource {
  nextUint32(): number;
}

export const cryptoRandomSource: RandomSource = {
  nextUint32() {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0];
  },
};

export function shuffle<T>(
  items: readonly T[],
  random: RandomSource = cryptoRandomSource,
) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = random.nextUint32() % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function randomOrientation(
  random: RandomSource = cryptoRandomSource,
) {
  return random.nextUint32() % 2 === 0 ? "upright" : "reversed";
}
