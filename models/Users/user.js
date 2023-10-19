const mongoose =require('mongoose');
const userSchema = require('./userSchema');
const mongoosePaginate = require('mongoose-paginate-v2');

userSchema.plugin(mongoosePaginate);

const User = mongoose.model(
  "User", userSchema
);

module.exports = User;
