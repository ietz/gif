export const findChangedIndex = (a: number[], b: number[]): number | null => {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return i
    }
  }

  return null;
}

export const clamp = (num: number, lower: number, upper: number) => {
  return Math.max(lower, Math.min(num, upper));
}
