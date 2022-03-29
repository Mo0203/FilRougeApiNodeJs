const User = require('../models/userModel.js');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; 
const LOGIN_REGEX = /\W+/g;

const createUser = async(req, res) => {

    let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let organisation = req.body.organisation;

    if (login == "" || login == null) {
        return res.status(400).json({'error':'Veuillez renseigner votre nom'});
    }
    if (LOGIN_REGEX.test(login)) {
        return res.status(400).json({'error':'Nom d\'utilisateur invalide'});
    }
    if (email == "" || email == null) {
        return res.status(400).json({'error':'Veuillez renseigner votre email'});
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({'error':'Email invalide'});
    }
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({'error':'Le mot de passe doit contenir au moins 8 caractères dont une majuscule et un chiffre'});
    }
    if (organisation == "" || organisation == null) {
        return res.status(400).json({'error':'Veuillez sélectionner une organisation'});
    }

    User.findOne({email: email}).then((user) => {
        if (user) {
            return res.status(400).json({'error':'l\'email est déjà utilisé'});
        } else {
            bcrypt.hash(password, 10, function(err, hashedPass) {
                const newUserRecord = new User({
                    login: login,
                    email: email,
                    password: hashedPass,
                    organisation: organisation
                })

                newUserRecord.save((err, result) => {
                    if (!err) {
                        return res.status(201).send(result);
                    } else {
                        return res.status(400).json({'error':'erreur lors de la création du nouvel utilisateur :',err});
                    }
                });
            });
        }
    }).catch((error)=> {
        return res.status(400).json({'error':+error});
    })
};

module.exports = { createUser };