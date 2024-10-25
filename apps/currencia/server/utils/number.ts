export function generateRandomValue(min: number = 300, max: number = 10000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
