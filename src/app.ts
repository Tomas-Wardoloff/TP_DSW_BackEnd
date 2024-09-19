import 'reflect-metadata'
import dotenv from 'dotenv'
import express from "express"
import { athleteRouter } from "./athlete/athlete.routes.js"
import { clubRouter } from "./club/club.routes.js"
import { agentRouter } from "./agent/agent.routes.js"
import { orm, syncSchema } from "./shared/db/orm.js"
import { RequestContext } from '@mikro-orm/core'
import { userRouter } from './user/user.routes.js'

dotenv.config()

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})

app.use('/api/athletes', athleteRouter)
app.use('/api/clubs', clubRouter)
app.use('/api/agents', agentRouter)
app.use('/api/users', userRouter)

app.use((_, res) => {
    return res.status(404).send({message: "Not found"})
})

await syncSchema() // never in production

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})
