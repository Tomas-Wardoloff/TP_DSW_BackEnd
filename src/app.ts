import 'reflect-metadata'
import dotenv from 'dotenv'
import cors from 'cors'
import express from "express"
import { athleteRouter } from "./athlete/athlete.routes.js"
import { clubRouter } from "./club/club.routes.js"
import { agentRouter } from "./agent/agent.routes.js"
import { orm, syncSchema } from "./shared/db/orm.js"
import { RequestContext } from '@mikro-orm/core'
import { userRouter } from './user/user.routes.js'
import { postRouter } from './post/post.routes.js'

dotenv.config()

const app = express()

app.use(express.json(), cors())

app.use(cors({ origin: 'http://localhost:4200' }))

app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})

app.use('/api/athletes', athleteRouter)
app.use('/api/clubs', clubRouter)
app.use('/api/agents', agentRouter)
app.use('/api/users', userRouter)
app.use('/api/posts/', postRouter)

app.use((_, res) => {
    return res.status(404).send({message: "Not found"})
})

await syncSchema() // never in production

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})
