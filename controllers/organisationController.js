const Orga = require("../models/organisationModel");
const ObjectId = require('mongoose').Types.ObjectId;
const ORGA_REGEX = /^[a-zA-Z0-9\-\s]+$/;

const getOrgs = async(req, res) => {

    let name = req.body.name;
    if (name) {
        if(checkOrga(name, res)) return res;
        Orga.findOne({name: name}).then((orga) => {
            if(orga) {
                return res.status(200).json({orga});
            } else {
                return res.status(400).json({'error':'Aucune organisation ne correspond a ce nom'});
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

const createOrg = async(req, res) => {

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

const updateOrg = async(req, res) => {

    let id = req.body.id;
    let name = req.body.name;
    if(checkOrga(name, res)) return res;

    if(!ObjectId.isValid(id)) return res.status(400).json({'error':'L\'ID spécifié n\'existe  pas'});
    Orga.findByIdAndUpdate(id,{$set: {
        name: name,
    }},{ new: true }, function(err, result) {
        if(err) {
            return res.status(500).json({'error':'Echec de la modification'});
        } else {
            return res.status(200).json({'success':'Modification réussie'});
        }
    })
};

const deleteOrg = async(req, res) => {

    let id = req.body.id;
    if(!ObjectId.isValid(id)) return res.status(400).json({'error':'L\'ID spécifié n\'existe  pas'});
    Orga.findByIdAndDelete(id,(err, result) => {
        if (!err) {
            return res.status(200).json({'success':'Organisation supprimée avec succès'});
        } else {
            return res.status(500).json({'error':'Erreur lors de la suppression'});
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

//On exporte nos fonctions
module.exports = { getOrgs, createOrg, updateOrg, deleteOrg };