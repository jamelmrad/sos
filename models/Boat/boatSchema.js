const Mongoose = require('mongoose');

const boatSchema = new Mongoose.Schema({
    serialNumber: String,
    name: String,
    ownerName: String,
    ownerCin: Number,
    ownerPassport: String,
    departurePort: String,
    destination: String,
    passengerNumber: Number,
    departureDay: Date,
    pavillon: String,
    userName: String,
    nationality: String,
    userPassport: Number
}, { timestamps: true });

module.exports = boatSchema;