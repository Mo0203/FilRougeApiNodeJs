const Insertion = require("../models/organisationModel");
const ObjectId = require('mongoose').Types.ObjectId;
const INSERTION_REGEX = /^[a-zA-Z0-9\-\s]+$/;


const getIns = async (req, res) => {

    let name = req.body.name;
    let financement = req.body.financement;
    let organisation = req.body.organisation;
    let but = req.body.but;
    let age_max = req.body.age_maxt;
    let age_min = req.body.age_min;
    let Date = req.body.Date;
    let duree = req.body.duree;
    let infosSup = req.body.infosSup;
    let url = req.body.url;
    let remuneration = req.body.remuneration;
    let id = req.body.id;

    if (name) {
        if (checkOrg(name, res)) return res;
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












function checkInsertion(name, res) {
    if (name == "" || name == null) {
        return res.status(400).json({ 'error': 'Veuillez renseigner le nom de l\'insertion' });
    }
    if (!ORGA_REGEX.test(name)) {
        return res.status(400).json({ 'error': 'Nom d\'insertion invalide (pas de caractères spéciaux)' });
    }
};