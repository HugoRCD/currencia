import { z } from 'zod'
import { Classification } from '@prisma/client'

const bodySchema = z.object({
  value: z.number(),
  message: z.string(),
  classification: z.nativeEnum(Classification),
  date: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  return prisma.sentiment.create({
    data: {
      value: body.value,
      message: body.message,
      classification: body.classification,
      date: body.date,
    },
  })
})
