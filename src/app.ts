import 'reflect-metadata'
import express from "express"
import { athleteRouter } from "./athletes/athlete.routes.js"
import { clubRouter } from "./club/club.routes.js"
import { agentRouter } from "./agent/agent.routes.js"
import { orm, syncSchema } from "./shared/db/orm.js"
import { RequestContext } from '@mikro-orm/core'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})

app.use('/api/athlete', athleteRouter)
app.use('/api/club', clubRouter)
app.use('/api/agent', agentRouter)

app.use((_, res) => {
    return res.status(404).send({message: "Not found"})
})

await syncSchema() // never in production

app.listen(3000, () => {
    console.log("server running on http://localhost:3000/")
})
