const Mongoose = require('mongoose');
const boatSchema = require('./boatSchema');
const mongoosePaginate = require('mongoose-paginate-v2');
boatSchema.plugin(mongoosePaginate);

const Boat = Mongoose.model(
    "boat", boatSchema
);

module.exports = Boat;