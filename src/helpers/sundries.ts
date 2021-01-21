export const FLOAT_TOLERANCE = 1e-3;

export function equalNumber(a: number, b: number, tolerance?: number) {
  return Math.abs(a - b) < (tolerance || FLOAT_TOLERANCE);
}
