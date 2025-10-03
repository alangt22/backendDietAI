import cors from '@fastify/cors'
import Fastify from 'fastify'
import { planRoutes } from './routes/plan.js'

const app = Fastify({
    logger: true,
})

await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST"],
})

app.get('/', (req, res) => {
    res.send('Hello WORLD from Fastify')
})

app.register(planRoutes)

app.listen({port: Number(process.env.PORT) || 3333, host: '0.0.0.0'})
.then(() => console.log('server running port 3333'))
.catch((err) => {
    app.log.error(err)
    process.exit(1)
})



