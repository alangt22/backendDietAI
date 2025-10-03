import type { FastifyInstance } from "fastify"
import { DietPlanRequestSchema } from "../types.js"
import { generateDietPlan } from "../index.js"

export async function planRoutes(app: FastifyInstance) {
  app.post("/plan", async (request, reply) => {
    reply.raw.setHeader("Access-Control-Allow-Origin", "*")
    reply.raw.setHeader("Content-Type", "text/plain; charset=utf-8")

    reply.raw.setHeader("Content-Type", "text/event-stream")
    reply.raw.setHeader("Cache-Control", "no-cache")
    reply.raw.setHeader("Connection", "keep-alive")

    const parse = DietPlanRequestSchema.safeParse(request.body)
    if (!parse.success) {
      return reply.status(400).send({
        error: "Validation error",
        details: parse.error.flatten((issue) => issue.message),
      })
    }

    try {
      for await (const delta of generateDietPlan(parse.data)) {
        reply.raw.write(delta)
      }
      reply.raw.end()
    } catch (error: any) {
      request.log.error(error)
      reply.raw.write(`event: error\n ${JSON.stringify(error.message)}`)
      reply.raw.end()
    }
    return reply
  })
}
