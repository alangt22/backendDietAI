import cors from "@fastify/cors"
import Fastify from "fastify"
import { planRoutes } from "./routes/plan.js"

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: "*",
  methods: ["GET", "POST"],
})

app.get("/", (req, res) => {
  res.send("Hello WORLD from Fastify")
})

app.register(planRoutes)

const port = Number(process.env.PORT) || 3333
const host = "0.0.0.0"

app
  .listen({ port, host })
  .then(() => console.log(`Server running on port ${port}`))
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
