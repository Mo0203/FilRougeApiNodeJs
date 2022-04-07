const Audience = require('../models/audienceModel.js');
const ObjectId = require('mongoose').Types.ObjectId;

const getAudience = async(req, res) => {
    const target = req.body.target;

    Audience.findOne({target: target})
    .then((audience) => {
        if(!audience) {
            return res.status(204).json({'error':'Aucune correspondance trouvée'});
        } else {
            res.status(200).send(audience);
        }
    })
    .catch((err) => {
        return res.status(500).json({'error':'Une erreur est survenue lors de la recherche'});
    })
};

const createAudience = async(req, res) => {
    const target = req.body.target;

    const newAudienceRecord = new Audience({
        target: target
    })

    newAudienceRecord.save((err, result) => {
        if(!err) {
            res.status(201).send(result);
        } else {
            return res.status(400).json({'error':'Une erreur est survenue lors de la création'});
        }
    })
};

const updateAudience = async(req, res) => {
    const id = req.body.id;
    const target = req.body.target;

    if(!ObjectId.isValid(id)) return res.status(400).json({'error':'L\'ID spécifié n\'existe  pas'});
    Audience.findByIdAndUpdate(id, {$set: {
        target: target,
    }}, {new: true}, function(err, result) {
        if(err) {
            return res.status(500).json({'error':'Echec de la modification'});
        } else {
            return res.status(200).json({'success':'Modification réussie'});
        }
    })
};

const deleteAudience = async(req, res) => {
    const id = req.body.id;
    if(!ObjectId.isValid(id)) return res.status(400).json({'error':'L\'ID spécifié n\'existe  pas'});
    Audience.findByIdAndDelete(id,(err, result) => {
        if (!err) {
            return res.status(200).json({'success':'Public cible supprimé avec succès'});
        } else {
            return res.status(500).json({'error':'Erreur lors de la suppression'});
        }
    })
}

module.exports = { getAudience, createAudience, updateAudience, deleteAudience };