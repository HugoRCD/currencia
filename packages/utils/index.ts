/**
 * Splits an array into chunks of a given size.
 * @param array The array to split.
 * @param chunkSize The size of each chunk.
 * @returns An array of chunks.
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}
