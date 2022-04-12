const Insertion = require('../models/insertionModel.js');
const Log = require('../models/logModel.js');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const modifUrl = false;
const dotenv = require('dotenv');
dotenv.config();

const getInsertions = async (req, res) => {

    Insertion.find((err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la requête des dispositifs d\'insertion:' + err });
        }
    })

};

const createInsertion = async (req, res) => {

    const userId = verifyToken(req, res);
    if (userId == null) return res;

    const title = req.body.title;
    const min_age = req.body.min_age;
    const max_age = req.body.max_age;
    const income = req.body.income;
    const url = req.body.url;
    const audience = req.body.audience;
    const duration = req.body.duration;
    const funding = req.body.funding;
    const organisation = req.body.organisation;
    const goal = req.body.goal;
    const info = req.body.info;
    console.log(res);
    if (checkInsert(title, min_age, max_age, url, res)) return res;
    if (modifUrl) {
        url = "https" + url.substring(4);
        modifUrl = false;
    }
    Insertion.findOne({ title: title }).then((insertion) => {
        if (insertion) {
            return res.status(400).json({ 'error': 'Ce dispositif d\'insertion existe déjà' });
        } else {
            const newInsertionRecord = new Insertion({
                title: title,
                min_age: min_age,
                max_age: max_age,
                income: income,
                url: url,
                audience: audience,
                duration: duration,
                funding: funding,
                organisation: organisation,
                goal: goal,
                info: info
            })

            newInsertionRecord.save((err, result) => {
                if (!err) {
                    saveLog(userId, result.id, "Created insertion")
                    res.status(201).send(result);
                } else {
                    return res.status(400).json({ 'error': 'Erreur survenue lors de la sauvegarde' });
                }
            })
        }
    })
};

const deleteInsertion = async (req, res) => {

    const userId = verifyToken(req, res);
    if (userId == null) return res;

    id = req.body.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    Insertion.findByIdAndDelete(id, (err, result) => {
        if (!err) {
            saveLog(userId, id, "Deleted insertion")
            return res.status(200).json({ 'success': 'Insertion supprimée avec succès' });
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la suppression' });
        }
    })
};

const updateInsertion = async (req, res) => {
    const userId = verifyToken(req, res);
    if (userId == null) return res;

    const userId = verifyToken(req, res);
    if (userId == null) return res;

    const id = req.body.id;
    const title = req.body.title;
    const min_age = req.body.min_age;
    const max_age = req.body.max_age;
    const income = req.body.income;
    const url = req.body.url;
    const audience = req.body.audience;
    const duration = req.body.duration;
    const funding = req.body.funding;
    const organisation = req.body.organisation;
    const goal = req.body.goal;
    const info = req.body.info;

    if (checkInsert(title, min_age, max_age, url, res)) return res;

    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    Insertion.findByIdAndUpdate(id, {
        $set: {
            title: title,
            min_age: min_age,
            max_age: max_age,
            income: income,
            url: url,
            audience: audience,
            duration: duration,
            funding: funding,
            organisation: organisation,
            goal: goal,
            info: info
        }
    }, { new: true }, function (err, result) {
        if (err) {
            return res.status(400).json({ 'error': 'Echec de la modification' });
        } else {
            saveLog(userId, id, "Modified insertion");
            return res.status(200).json({ 'success': 'Modification réussie' });
        }
    })
};

const getInsertionByAge = async (req, res) => {
    const age = req.body.age;

    Insertion.find({ $and: [{ min_age: { $lte: age } }, { max_age: { $gte: age } }] }, (err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            return res.status(204).json({ 'error': 'Aucun dispositif d\'insertion ne correspond a l\'âge donné' });
        }
    })
};

const getByOrganisation = async (req, res) => {
    const organisation = req.body.organisation;

    Insertion.find({ organisation: organisation }, (err, result) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            return res.status(204).json({ 'error': 'Aucun dispositif d\'insertion ne correspond a l\'organisation donnée' })
        }
    })
}

function checkInsert(title, min_age, max_age, url, res) {
    if (title == "" || title == null) {
        return res.status(400).json({ 'error': 'Veuillez renseigner le nom de l\'organisation' });
    }
    if (min_age > max_age) {
        return res.status(400).json({ 'error': 'L\'age maximum doit être supérieur au minimum' });
    }
    if (!(max_age > 0 && min_age > 0)) {
        return res.status(400).json({ 'error': 'Veuillez entrer un age valide' });
    }
    if (!(url.substring(0, 5) == "https")) {
        modifUrl = true;
        console.log("Url modifié");
    }
};

function saveLog(actorId, targetId, action) {
    const newLog = new Log({
        userId: actorId,
        action: action + " id: " + targetId
    })
    newLog.save((err, result) => {
        if (!err) {
            console.log("Log saved");
        } else {
            console.log("Error, couldn't save log");
        }
    });
}

// fonction de vérification de la validité du token, renvoie null si erreur
function verifyToken(req, res) {
    try {
        jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET, function (tokenErr, decoded) {
            if (tokenErr) throw new Error(tokenErr);
            req.auth = decoded;
        })
    } catch (e) {
        res.status(403).json({ 'error': 'Token invalide ' + e });
        return null;
    }
    return req.auth.sub;
}

module.exports = { getInsertions, getInsertionByAge, getByOrganisation, createInsertion, deleteInsertion, updateInsertion };
