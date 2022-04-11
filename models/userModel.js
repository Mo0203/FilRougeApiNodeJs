const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String },
    email: { type: String }, //Parametres = (type : String,int ect...) et (required(champs obligatoirement requis ou non))
    password: { type: String },
    organisation: { type: String },
    isAdmin: { type: Boolean },
    date: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
