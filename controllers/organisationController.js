const Orga = require("../models/organisationModel");
const ObjectId = require('mongoose').Types.ObjectId;
const ORGA_REGEX = /^[a-zA-Z0-9\-\s]+$/;

const getOrgs = (req, res) => {

    Orga.find((err, result) => {
        if (!err) {
            return res.status(200).send(result);
        } else {
            return res.status(400).json({ 'error': +err });
        }
    }).sort({ name: 1 });
};

const createOrg = (req, res) => {

    if (checkOrg(req.body.name, res)) return res;

    const newOrgRecord = new Orga({
        name: req.body.name
    })

    newOrgRecord.save((err, result) => {
        if (!err) {
            res.status(201).send(result);
        } else {
            return res.status(400).json({ 'error': +err });
        }
    })
};



const updateOrg = async (req, res) => {

    let id = req.body.id;
    let name = req.body.name;

    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': "L'ID spécifié pour la mise à jour de l'utilisateur est introuvable" });

    Orga.findByIdAndUpdate(id, {
        $set: {
            name: name,
        }

    }, { new: true }, function (err, result) {
        if (err) {
            return res.status(400).json({ 'error': 'Echec de la mise a jour de l\'organisation' })
        } else {
            return res.status(200).json({ result });
        }
    });
};

const deleteOrg = async (req, res) => {
    if (!ObjectId.isValid(req.body.id)) return res.status(400).json({ 'error': "L'ID spécifié pour la suppression de l'organisation est introuvable" });

    Orga.findByIdAndDelete(
        req.body.id,
        (err, result) => {
            if (!err) {
                return res.status(200).json({ 'success': ' organisation supprimée avec succès' });
            } else {
                return res.status(500).json({ 'error': 'erreur serveur lors de la suppression de l\'organisation : ' + err });
            }
        }
    )
}

function checkOrg(name, res) {
    if (name == "" || name == null) {
        return res.status(400).json({ 'error': 'Veuillez renseigner le nom de l\'organisation' });
    }
    if (!ORGA_REGEX.test(name)) {
        return res.status(400).json({ 'error': 'Nom d\'organisation invalide (pas de caractères spéciaux)' });
    }
};


//On exporte nos fonctions
module.exports = { getOrgs, createOrg, updateOrg, deleteOrg };