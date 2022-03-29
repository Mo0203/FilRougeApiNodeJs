const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    organisation: { type: String },
    date: { type: Date, default: Date.now },

});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
