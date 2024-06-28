import express from "express"
import { athleteRouter } from "./athletes/athlete.routes.js"
import { clubRouter } from "./club/club.routes.js"

const app = express()
app.use(express.json())

app.use('/api/athletes', athleteRouter)
app.use('/api/clubs', clubRouter)

app.use((_, res) => {
    return res.status(404).send({message: "Not found"})
})

app.listen(3000, () => {
    console.log("server running on http://localhost:3000/")
})
