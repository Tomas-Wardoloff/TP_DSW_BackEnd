import { Club } from './clubs.entity.js';
import { ClubRepository } from './club.repository.js';
const repository = new ClubRepository();
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const club = repository.findOne({ id: req.params.id });
    // If no club is found, return a 404 response
    if (!club) {
        res.status(404).send({ message: 'Club not found' });
    }
    res.json({ data: club });
}
function add(req, res) {
    // Destructure the request body to extract the club properties
    const { id, email, contact, type, created_at, is_active, name, opening_date } = req.body;
    // Create a new Athlete object with the provided details
    const new_club = new Club(id, email, contact, type, created_at, is_active, name, opening_date);
    repository.add(new_club);
    res.status(201).send({ message: 'Club created', data: new_club });
}
function update(req, res) {
    const club = repository.update(req.body);
    if (!club) {
        res.status(404).send({ message: 'Club not found' });
    }
    else {
        res.status(200).send({ message: 'Club updated successfully', data: club });
    }
}
function remove(req, res) {
    const club = repository.delete({ id: req.params.id });
    if (!club) {
        res.status(404).send({ message: 'Club not found' });
    }
    else {
        res.status(200).send({ message: 'Club deleted successfully' });
    }
}
// Export the functions to be used in the routes
export { findAll, findOne, add, update, remove };
//# sourceMappingURL=club.controler.js.map