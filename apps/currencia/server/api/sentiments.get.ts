export default defineEventHandler(() => {
  return prisma.sentiment.findMany()
})
