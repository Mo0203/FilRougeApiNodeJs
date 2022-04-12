const Orga = require("../models/organisationModel");
const ObjectId = require('mongoose').Types.ObjectId;
const ORGA_REGEX = /^[a-zA-Z0-9\-\s]+$/;

const getOrgs = async (req, res) => {

    let name = req.body.name;
    if (name) {
        if (checkOrga(name, res)) return res;
        Orga.findOne({ name: name }).then((orga) => {
            if (orga) {
                return res.status(200).json({ orga });
            } else {
                return res.status(400).json({ 'error': 'Aucune organisation ne correspond a ce nom' });
            }
        })
    } else {
        Orga.find((err, result) => {
            if (!err) {
                return res.status(200).send(result);
            } else {
                return res.status(400).json({ 'error': +err });
            }
        }).sort({ name: 1 });
    }
};

const createOrg = async (req, res) => {
    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;


    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;

    if (checkOrga(req.body.name, res)) return res;

    const newOrgRecord = new Orga({
        name: req.body.name
    })

    newOrgRecord.save((err, result) => {
        if (!err) {
            res.status(201).send(result);
        } else {
            return res.status(400).json({ 'error': 'Erreur survenue lors de la sauvegarde' });
        }
    })
};

const updateOrg = async (req, res) => {
    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;


    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;

    let id = req.body.id;
    let name = req.body.name;
    if (checkOrga(name, res)) return res;

    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    Orga.findByIdAndUpdate(id, {
        $set: {
            name: name,
        }
    }, { new: true }, function (err, result) {
        if (err) {
            return res.status(500).json({ 'error': 'Echec de la modification' });
        } else {
            return res.status(200).json({ 'success': 'Modification réussie' });
        }
    })
};

const deleteOrg = async (req, res) => {
    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;


    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;

    let id = req.body.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    Orga.findByIdAndDelete(id, (err, result) => {
        if (!err) {
            return res.status(200).json({ 'success': 'Organisation supprimée avec succès' });
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la suppression' });
        }
    })
};


function checkOrga(name, res) {
    if (name == "" || name == null) {
        return res.status(400).json({ 'error': 'Veuillez renseigner le nom de l\'organisation' });
    }
    if (!ORGA_REGEX.test(name)) {
        return res.status(400).json({ 'error': 'Nom d\'organisation invalide (pas de caractères spéciaux)' });
    }
};
// checks is user retrieved from token has admin rights
function adminCheck(userId) {
    User.findById(userId, function (err, result) {
        if (err) {
            res.status(404).json({ 'error': 'Utilisateur introuvable' });
        } else {
            if (result.isAdmin) {
                return true;
            } else {
                res.status(403).json({ 'error': 'Vous ne disposez pas des droits' });
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
        res.status(403).json({ 'error': 'Token invalide ' + e });
        return null;
    }
    return req.auth.sub;
}

module.exports = { getOrgs, createOrg, updateOrg, deleteOrg }
