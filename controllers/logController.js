const Log = require('../models/logModel.js');
const User = require('../models/userModel.js');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');

const getLogs = async (req, res) => {

    const userId = verifyToken(req, res);
    if (userId == null) return res;
    
    if (!ObjectId.isValid(userId)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });

    if(adminCheck(userId) == false) return res;
    Log.find((err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la requête des logs:' + err });
        }
    });
}

const getLog = async (req, res) => {

    const userId = verifyToken(req, res);
    if (userId == null) return res;

    if (!ObjectId.isValid(userId)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    if(adminCheck(userId) == false) return res;
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


const getLogByUser = async (req, res) => {

    const userId = verifyToken(req, res);
    if (userId == null) return res;

    if (!ObjectId.isValid(userId)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    if(adminCheck(userId) == false) return res;
    if (userId == null) return res;        
    const id = req.body.userId;
    Log.find(({ userId: id }), (logErr, result) => {
        if (!logErr) {
            res.status(200).send(result);
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la requête des logs:' + err });
        }
    })
}

const deleteLog = async (req, res) => {

    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (!ObjectId.isValid(userId)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    if(adminCheck(userId) == false) return res;
    id = req.body.id;
    if(!ObjectId.isValid(id)) return res.status(400).json({'error':'L\'ID spécifié n\'existe  pas'});
    Log.findByIdAndDelete(id,(err, result) => {
        if (!err) {
            return res.status(200).json({'success':'Log supprimée avec succès'});
        } else {
            return res.status(500).json({'error':'Erreur lors de la suppression'});
        }
    })
}

// checks is user retrieved from token has admin rights
function adminCheck(userId) {
    User.findById(userId, function (err, result) {
        if(err) {
            res.status(404).json({'error':'Utilisateur introuvable'});
        } else {
            if (result.isAdmin) {
                return true;
            } else {
                res.status(403).json({'error':'Vous ne disposez pas des droits'});
            }
        }
    })
    return false;
}

// fonction de vérification de la validité du token, renvoie null si erreur
function verifyToken(req, res) {
    try {
        jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET, function (tokenErr, decoded) {
            if (tokenErr) throw new Error(tokenErr);
            req.auth = decoded;
        })
    } catch (e) {
       res.status(403).json({'error':'Token invalide '+e});
       return null;
    }
    return req.auth.sub;
}


module.exports = { getLogs, getLog, getLogByUser, deleteLog };