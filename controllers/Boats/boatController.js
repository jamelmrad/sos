const Boat = require("../../models/Boat/boat");
const User = require("../../models/Users/user");

// create boat
exports.create = async (req, res) => {
    const user = await User.findById(req.body.id)
    const newBoat = new Boat({
        serialNumber: req.body.serialNumber,
        name: req.body.name,
        ownerName: req.body.ownerName,
        ownerCin: req.body.ownerCin,
        ownerPassport: req.body.ownerPassport,
        departurePort: req.body.departurePort,
        destination: req.body.destination,
        passengerNumber: req.body.passengerNumber,
        departureDay: new Date(req.body.departureDay),
        pavillon: req.body.pavillon,
        userName: req.body.userName,
        nationality: req.body.nationality,
        userPassport: req.body.userPassport
    });
    if (user) {
        user.boat = newBoat
        await user.save()
    }
    newBoat.save()
        .then((boat) => { res.send(boat) })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred."
            });
        });

}
// find all boats
exports.findAll = async (req, res) => {
    const { query, page, limit = 10 } = req.query
    const options = {
        page,
        limit,
        collation: {
            locale: 'en'
        }
    }
    const regexQuery = new RegExp(query, 'i')
    try {
        const boats = await Boat.paginate({ serialNumber: regexQuery }, options);
        res.send(boats);
    } catch (err) {
        res.status(500).send({
            message:
                err || "Some error occurred while retrieving users."
        });
    }
}

// update boat 
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    try {
        await Boat.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
        await User.updateMany({ 'boat._id': req.params.id }, {
            "boat.serialNumber": req.body.serialNumber,
            "boat.name": req.body.name,
            "boat.ownerName": req.body.ownerName,
            "boat.ownerCin": req.body.ownerCin,
            "boat.ownerPassport": req.body.ownerPassport,
            "boat.departurePort": req.body.departurePort,
            "boat.destination": req.body.destination,
            "boat.passengerNumber": req.body.passengerNumber,
            "boat.departureDay": new Date(req.body.departureDay),
            "boat.pavillon": req.body.pavillon,
            "boat.userName": req.body.userName,
            "boat.nationality": req.body.nationality,
            "boat.userPassport": req.body.userPassport
        });
        return res.send({ message: "Boat was updated successfully." });
    } catch (err) {
        res.status(500).send({
            message: "Error updating boat with id=" + req.params.id
        });
    }
}
// delete boat
exports.delete = async (req, res) => {
    try {
        await Boat.findByIdAndRemove(req.params.id);
        res.send({ message: "Boat deleted successfully!" });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete boat with id=" + req.params.id
        });
    }
};
