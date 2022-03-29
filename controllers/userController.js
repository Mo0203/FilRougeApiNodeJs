const User = require('../models/userModel.js');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; 
const LOGIN_REGEX = /\W+/g;

const getUser = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    checkEmail(email, res);

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ 'message': 'Email introuvable' });
            } else {
                bcrypt.compare(password, user.password, function (err, boolCrypt) {
                    if (boolCrypt) {
                        return res.status(200).json({ user });
                    } else if (!boolCrypt) {
                        return res.status(400).json({ 'message': 'Mot de passe incorrect' });
                    } else {
                        return res.status(400).json({ 'message': 'Une erreur est survenue' + err });
                    }
                })


            }
        })
        .catch((err) => {
            return res.status(400).json({ 'message': 'Une erreur est survenue' + err });
        })
}


const createUser = async(req, res) => {

    let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let organisation = req.body.organisation;

    checkUser(login, password, organisation, res);
    checkEmail(email, res);

    User.findOne({email: email}).then((user) => {
        if (user) {
            return res.status(400).json({'error':'l\'email est déjà utilisé'});
        } else {
            bcrypt.genSalt(10, function(err, salt) {

                bcrypt.hash(password, salt, function(err, hashedPass) {
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
            });
        }
    }).catch((error)=> {
        return res.status(400).json({'error':+error});
    })
};

const updateUser = async(req, res) => {

    let id = req.body.id;
    let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let organisation = req.body.organisation;

    checkEmail(email, res);
    checkUser(login, password, organisation, res);

    User.findByIdAndUpdate(id, {
        login: login,
        email: email,
        password: password,
        organisation: organisation
    }, function(err, result) {
        if (err) {
            return res.status(400).json({'error':'Echec de la mise a jour de l\'utilisateur'})
        } else {
            return res.status(200).json({result});
        }
    })
}

function checkEmail(email, res) {
    if (email == "" || email == null) {
        return res.status(400).json({'error':'Veuillez renseigner votre email'});
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({'error':'Email invalide'});
    }
}

function checkUser(login, password, organisation, res) {
    if (login == "" || login == null) {
        return res.status(400).json({'error':'Veuillez renseigner votre nom'});
    }
    if (LOGIN_REGEX.test(login)) {
        return res.status(400).json({'error':'Nom d\'utilisateur invalide'});
    }
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({'error':'Le mot de passe doit contenir au moins 8 caractères dont une majuscule et un chiffre'});
    }
    if (organisation == "" || organisation == null) {
        return res.status(400).json({'error':'Veuillez sélectionner une organisation'});
    }
}

module.exports = { createUser, getUser, updateUser };