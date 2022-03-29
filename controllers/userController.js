const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const ObjectId = require('mongoose').Types.ObjectId;

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const LOGIN_REGEX = /\W+/g;

// const bannedArray = ['%', '/', '\\', '>', '"', "'", ]

const getUser = async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    checkEmail(email, res);

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ 'message': 'Email introuvable' });
            } else {
                bcrypt.compare(password, user.password, function(err, boolCrypt) {
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
        });
};


const createUser = async(req, res) => {

    let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let organisation = req.body.organisation;

    checkUser(login, password, organisation, res);
    checkEmail(email, res);


    // TO DO -> check si l'organisation est dans la liste une fois la méthode et l'api done à ce niveau

    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ 'error': 'l\'email est déjà utilisé' });
            } else {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hashedPassword) {

                        const newUserRecord = new User({
                            login: login,
                            email: email,
                            password: hashedPassword,
                            organisation: organisation
                        })

                        newUserRecord.save((err, result) => {
                            if (!err) {
                                return res.status(201).send(result);
                            } else {
                                return res.status(400).json({ 'error': 'erreur lors de la création du nouvel utilisateur : ', err });
                            }
                        });
                    });
                })

            }
        }).catch((error) => {
            return res.status(400).json({ 'error': +error });
        });
};

function checkUser(login, password, organisation, res) {
    if (password == "" || password == null) {
        return res.status(400).json({ 'error': 'veuillez renseigner votre mot de passe' });
    }

    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ "error": 'le mot de passe doit contenir au moins huit caractères, dont au moins une majuscule et un chiffre' });
    }

    if (organisation == '' || organisation == null) {
        return res.status(400).json({ 'error': "veuillez renseigner votre organisation" });
    }

    if (login == "" || login == null) {
        return res.status(400).json({ 'error': 'veuillez renseigner votre nom' });
    }
    // if (LOGIN_REGEX.test(login)) {
    //     return res.status(400).json({ 'error': 'Nom d\'utilisateur invalide' });
    // }
}

function checkEmail(email, res) {
    if (email == "" || email == null) {
        return res.status(400).json({ 'error': 'veuillez renseigner votre email' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'l\'email est invalide' });
    }
}

module.exports = { getUser, createUser }