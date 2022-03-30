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

    if (checkOrga(req.body.name, res)) return res;

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


function checkOrga(name, res) {
    if (name == "" || name == null) {
        return res.status(400).json({ 'error': 'Veuillez renseigner le nom de l\'organisation' });
    }
    if (!ORGA_REGEX.test(name)) {
        return res.status(400).json({ 'error': 'Nom d\'organisation invalide (pas de caractères spéciaux)' });
    }
}

//On exporte nos fonctions
module.exports = { getOrgs, createOrg };