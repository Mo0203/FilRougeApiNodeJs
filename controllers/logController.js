const Log = require('../models/logModel.js');
const User = require('../models/userModel.js');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');

const getLogs = async (req, res) => {

    const userId = jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET).sub;
    if (!ObjectId.isValid(userId)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });

    User.findById(userId, function(err, docs) {
        if(err) {
            return res.status(404).json({'error':'Utilisateur introuvable'});
        } else {
            if(docs.isAdmin) {
                Log.find((err, result) => {
                    if (!err) {
                        res.status(200).send(result);
                    } else {
                        return res.status(500).json({ 'error': 'Erreur lors de la requête des logs:' + err });
                    }
                })
            } else {
                return res.status(403).json({'error':'L\'utilisateur spécifié n\'est pas administrateur'});
            }
        }
    })
    
}

const getLog = async (req, res) => {

    const userId = jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET).sub;
    if (!ObjectId.isValid(userId)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });

    User.findById(userId, function(err, docs) {
        if(err) {
            return res.status(404).json({'error':'Utilisateur introuvable'});
        } else {
            if(docs.isAdmin) {
                const id = req.body.id;
                if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
                Log.findById(id, function (err, docs) {
                    if (err) {
                        return res.status(500).json({ 'error': 'Aucun element correspondant' });
                    }
                    else {
                        res.status(200).send(docs);
                    }
                });
            }
        }
    })
    
}


const getLogByUser = async (req, res) => {

    const userId = jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET, function (tokenError, success) {
        if(err) {
            return null;
        }
    }).sub;
    if (!ObjectId.isValid(userId)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });

    User.findById(userId, function(err, docs) {
        if(err) {
            return res.status(404).json({'error':'Utilisateur introuvable'});
        } else {
            if(docs.isAdmin) {
                const id = req.body.userId;
                Log.find(({ userId: id }), (err, result) => {
                    if (!err) {
                        res.status(200).send(result);
                    } else {
                        return res.status(500).json({ 'error': 'Erreur lors de la requête des logs:' + err });
                    }
                })
            }
        }
    })
    
}

module.exports = { getLogs, getLog, getLogByUser, };//deleteLog }