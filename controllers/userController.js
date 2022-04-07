const User = require('../models/userModel.js');
const Log = require('../models/logModel.js');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const LOGIN_REGEX = /^[a-zA-Z0-9\-\s]+$/;

const getUser = async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (checkEmail(email, res)) return res;

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ 'error': 'Email introuvable' });
            } else {
                bcrypt.compare(password, user.password, function(err, boolCrypt) {
                    if (boolCrypt) {
                        res.status(200).send({"user":user,"token":generateToken(user.id)});
                    } else if (!boolCrypt) {
                        return res.status(400).json({ 'error': 'Mot de passe incorrect' });
                    } else {
                        return res.status(400).json({ 'error': 'Une erreur est survenue' + err });
                    }
                })


            }
        })
        .catch((err) => {
            return res.status(500).json({ 'error': 'Une erreur est survenue' + err });
        });
};


const createUser = async(req, res) => {

    let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let organisation = req.body.organisation;

    if (checkUser(login, password, organisation, res)) return res;
    if (checkEmail(email, res)) return res;

    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(400).json({ 'error': 'l\'email est déjà utilisé' });
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
                            return res.status(400).json({ 'error': 'erreur lors de la création du nouvel utilisateur :', err });
                        }
                    });
                });
            });
        }
    }).catch((error) => {
        return res.status(400).json({ 'error': +error });
    })
};

const updateUser = async(req, res) => {
    let userId = jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET).sub;
    let id = req.body.id;
    let login = req.body.login;
    let email = req.body.email;
    let password = req.body.password;
    let organisation = req.body.organisation;

    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': "L'ID spécifié pour la mise à jour de l'utilisateur est introuvable" });

    if (checkUser(login, password, organisation, res)) return res;
    if (checkEmail(email, res)) return res;

    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(password, salt, (err, hashedPass) => {
        if (err) {
            return res.status(500).json({ 'error': 'Une erreur est survenue lors de la sécurisation du mot de passe' });
        }


        User.findByIdAndUpdate(id, {
            $set: {
                login: login,
                email: email,
                password: hashedPass,
                organisation: organisation
            }
        }, { new: true }, function(err, result) {
            if (err) {
                return res.status(400).json({ 'error': 'Echec de la mise a jour de l\'utilisateur' })
            } else {
                saveLog(userId, id, "Modified user")
                return res.status(200).json({ result });
            }
        })

    })
}


const deleteUser = async(req, res) => {
    if (!ObjectId.isValid(req.body.id)) return res.status(400).json({ 'error': "L'ID spécifié pour la suppression de l'utilisateur est introuvable" });

    User.findByIdAndDelete(
        req.body.id,
        (err, result) => {
            if (!err) {
                saveLog(jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET).sub, req.body.id, "Deleted user");
                return res.status(200).json({ 'success': ' Utilisateur supprimé avec succès' });
            } else {
                return res.status(500).json({ 'error': 'erreur serveur lors de la suppression de l\'utilisateur : ' + err });
            }
        }
    )
}


function checkEmail(email, res) {
    if (email == "" || email == null) {
        return res.status(400).json({ 'error': 'Veuillez renseigner votre email' });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'Email invalide' });
    }
}

function checkUser(login, password, organisation, res) {
    if (login == "" || login == null) {
        return res.status(400).json({ 'error': 'Veuillez renseigner votre nom' });
    }
    if (!LOGIN_REGEX.test(login)) {
        return res.status(400).json({ 'error': 'Nom d\'utilisateur invalide' });
    }
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 'error': 'Le mot de passe doit contenir au moins 8 caractères dont une majuscule et un chiffre' });
    }
    if (organisation == "" || organisation == null) {
        return res.status(400).json({ 'error': 'Veuillez sélectionner une organisation' });
    }
}

function generateToken(userId) {
    return jwt.sign({"sub":userId}, process.env.TOKEN_SECRET, { expiresIn: '120m'});
}

function saveLog(actorId, targetId, action) {
    const newLog = new Log({
        userId: actorId,
        action: action+" id: "+targetId
    })
    newLog.save((err, result) => {
        if (!err) {
            console.log("Log saved");
        } else {
            console.log("Error, couldn't save log");
        }
    });
}


module.exports = { createUser, getUser, updateUser, deleteUser };