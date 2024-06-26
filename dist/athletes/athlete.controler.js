import { Athlete } from './athlete.entity.js';
import { AthleteRepository } from './athlete.repository.js';
const repository = new AthleteRepository();
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const athlete = repository.findOne({ id: req.params.id });
    if (!athlete) {
        res.status(404).send({ message: "Athlete not found" });
    }
    res.json({ data: athlete });
}
function add(req, res) {
    const { id, email, contact, type, created_at, is_asctive, name, last_name, sport, position, is_signed } = req.body;
    const new_athlete = new Athlete(id, email, contact, type, created_at, is_asctive, name, last_name, sport, position, is_signed);
    repository.add(new_athlete);
    res.status(201).send({ message: 'Athlete created', data: new_athlete });
}
function update(req, res) {
    const athlete = repository.update(req.body);
    if (!athlete) {
        res.status(404).send({ message: 'Athlete not found' });
    }
    else {
        res.status(200).send({ message: 'Athlete updated successfully', data: athlete });
    }
}
function remove(req, res) {
    const athlete = repository.delete({ id: req.params.id });
    if (!athlete) {
        res.status(404).send({ message: 'Athlete not found' });
    }
    else {
        res.status(200).send({ message: 'Athlete deleted successfully' });
    }
}
export { findAll, findOne, add, update, remove };
//# sourceMappingURL=athlete.controler.js.map