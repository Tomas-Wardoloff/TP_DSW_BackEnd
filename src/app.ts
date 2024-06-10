import express from "express"
import { Athlete } from "./modules/athletes.js"

const app = express()
app.use(express.json())

const athletes = [
    new Athlete(
        '1',
        'manuelginobili@gmail.com',
        'celu_manu',
        'athlete',
        new Date,
        true,
        'manuel',
        'ginobili',
        'basquet',
        'base',
        false
    ),
]

app.get('/api/athlete', (req, res) => { 
    // get all the athletes
    res.json(athletes)
})

app.post('/api/athlete', (req, res) => { 
    // post athlete
    const {id, email, contact, type, created_at, is_asctive, name, last_name, sport, position, is_signed} = req.body
    
    const new_athlete = new Athlete(
        id, email, contact, type, created_at, is_asctive, name, last_name, sport, position, is_signed
    )
    athletes.push(new_athlete)
    res.status(201).send({message: 'Athlete created', data: new_athlete})
})

app.get('/api/athlete/:id', (req, res) => { 
    // get athlete by id
    const athlete = athletes.find((athlete) => athlete.id === req.params.id)
    
    if (!athlete){
        res.status(404).send({message: "Athlete not found"})
    }
    res.json(athlete)
})

app.delete('/api/atlete/:id', (req, res) => { 
    // delete athlete
    const athlete_index = athletes.findIndex((athlete) => athlete.id == req.params.id)
    
    if (athlete_index == -1){
        res.status(404).send({message: 'Athlete not found'})
    }
    else{
        athletes.splice(athlete_index, 1)
        res.status(200).send({message: 'Athlete deleted successfully'})
    }
})

app.put('/api/athlete/:id', (req, res) => { 
    // update athelte
    const athlete_index = athletes.findIndex((athlete) => athlete.id == req.params.id)
    
    if (athlete_index == -1){
        res.status(404).send({message: 'Athlete not found'})
    }else{
        const input = {
            id: req.body.id,
            email: req.body.email,
            contact: req.body.contact,
            type: req.body.type,
            created_at: req.body.created_at,
            is_active: req.body.is_active,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            sport: req.body.sport,
            postion: req.body.position,
            is_signed: req.body.is_signed,
        }
        athletes[athlete_index] = {...athletes[athlete_index], ...input}
    
        res.status(200).send({message: 'Athlete updated successfully', data: athletes[athlete_index]})
    }
})

app.listen(3000, () => {
    console.log("server running on http://localhost:3000/")
})
