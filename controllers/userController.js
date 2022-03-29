
const User = require('../models/userModel');// je charge mon modele d'utilisation qui se trouve dans model et qui s'appelle userModel
const ObjetcId = require('mongoose').Types.objectId;
const Bcrypt = require('bcrypt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
//const bannedArray = ['%', '/', '\\', '<', '>', '=', '"', "'", '(', ')', '[', ']', '{', '}']// je crée un tableau pour bannir certain caractères de mon txtFielLogin;
const LOGIN_REGEX = /\W+/g; // je crée une regex afin d'exclure les caractères spéciaux qui je ne souhaite pas voir apparaitre



const getUser = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    checkEmail(email, res);

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ 'message': 'Email introuvable' });
            } else {
                Bcrypt.compare(password, user.password, function (err, boolCrypt) {
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




const createUser = async (req, res) => {
    let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let organisation = req.body.organisation;

    checkEmail(email, res);
    checkUser(login, password, organisation, res);//ce sont les fonctions qui check, je les aient créer plus bas afin de ne pas les appeller à chaque route créee = get, create, update, delete


    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ 'message': 'E-mail déjà utilisé' });
            } else {
                Bcrypt.hash(password, 10, function (err, hashedPassword) {
                    const newUserRecord = new User({
                        login: login,
                        email: email,
                        password: hashedPassword,
                        organisation: organisation,
                    })
                    newUserRecord.save((err, result) => {
                        if (!err) {
                            res.status(201).send(result);
                        } else {
                            return res.status(400).json({ 'message': 'Erreur lors de la création du nouvel utilisateur' })
                        }
                    });
                });
            }
        }).catch((error) => {
            return res.statuts(400).json({ 'message': + error });
        });

};




function checkEmail(email, res) {
    if (email == '' || email == null) {
        return res.status(400).json({ 'message': 'Merci de rensigner votre e-mail' })
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'message': 'E-mail invalide' })
    }
}

function checkUser(login, password, organisation, res) {
    if (login == '' || login == null) {
        return res.status(400).json({ 'message': 'Merci de renseigner votre nom' });
    }

    // if (LOGIN_REGEX.test(login)) {
    // return res.status(400).json({ 'message': 'Nom d utilisateur invalide' });
    // }


    if (password == '' || paswword == null) {
        return res.status(400).json({ 'message': 'Merci de rensigner votre mot de passe' })
    }

    if (!PASSWORD_REGEX.test(email)) {
        return res.status(400).json({ 'message': 'Le mot de passe doit contenir au moins 8 caractères, au moins une majuscule, au moins un chiffre' })
    }

    if (organisation == '' || organisation == null) {
        return res.status(400).json({ 'message': 'Vous devez choisir une organisation' })
    }
}


module.exports = { createUser, getUser }