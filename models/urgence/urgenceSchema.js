const Mongoose = require('mongoose');
const userSchema = require('../Users/userSchema');

const urgenceSchema = new Mongoose.Schema({
    longitude: Number,
    latitude: Number,
    type: String,
    taille: String,
    age: String,
    niveau: Number,
    nbrpersonne: String,
    depart: String,
    nomprenom: String,
    distance: Number,
    status: String,
    tel: Number,
    communication: String,
    police: String,
    cloture: String,
    other: String,
    user: userSchema
}, { timestamps: true });

module.exports = urgenceSchema;