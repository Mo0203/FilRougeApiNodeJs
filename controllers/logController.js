const Log = require('../models/logModel.js');
const ObjectId = require('mongoose').Types.ObjectId;

const getLogs = async (req, res) => {
    Log.find((err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la requête des logs:' + err });
        }
    })
}

const getLog = async (req, res) => {
    let id = req.body.id;
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
    let id = req.body.userId;
    Log.find(({ userId: id }), (err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la requête des logs:' + err });
        }
    })
}

module.exports = { getLogs, getLog, getLogByUser, };//deleteLog }