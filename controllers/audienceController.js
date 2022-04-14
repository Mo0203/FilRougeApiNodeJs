const Audience = require('../models/audienceModel.js');
const ObjectId = require('mongoose').Types.ObjectId;

const getAudience = async (req, res) => {
    /*  #swagger.tags = ['Public ciblé']

        #swagger.description = 'Liste des publics ciblés présents dans la base de données.'

        #swagger.responses[200] = { 
            description: 'Requête reussie, la liste des publics ciblés présents dans la base de données est reçue correctement.',
            content:"application/json",
            schema: {$ref: "#/definitions/audience"}}
        #swagger.responses[204] = {
             description: 'Requête reussie, mais il n\'existe aucun contenu à renvoyer.'}
        #swagger.responses[500] = {
             description: 'Erreur interne'}
    */

    const target = req.body.target;

    Audience.findOne({ target: target })
        .then((audience) => {
            if (!audience) {
                return res.status(204).json({ 'error': 'Aucune correspondance trouvée' });
            } else {
                res.status(200).send(audience);
            }
        })
        .catch((err) => {
            return res.status(500).json({ 'error': 'Une erreur est survenue lors de la recherche' });
        })
};

const createAudience = async (req, res) => {


    /*  #swagger.tags = ['Public ciblé']

        #swagger.description = 'Ajouter un public ciblé dans la base de données'

        #swagger.parameters['target'] = {description: "Dénomination du public ciblé"}

         #swagger.security = [{
            "JWT": []
        }]

        #swagger.responses[201] = { 
            description: 'Requête reussie, public ciblé correctement ajouté à la base de données.'}
        #swagger.responses[400] = {
             description: 'Mauvaise requête, les informations envoyées ne peuvent pas être traitées.'}
         #swagger.responses[403] = {
             description: 'Requête exécutée, accès interdit, token invalide.'}
        #swagger.responses[403] = {
             description: 'Requête exécutée, accès interdit, l\'utilisateur ne dispose pas des droits. (il n'est pas administrateur)'}
        #swagger.responses[404] = {
             description: 'Requête exécutée, utilisateur non-trouvé.'}
        #swagger.responses[500] = {
             description: 'Erreur interne.'}
    */



    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;

    const target = req.body.target;

    const newAudienceRecord = new Audience({
        target: target
    })

    newAudienceRecord.save((err, result) => {
        if (!err) {
            res.status(201).send(result);
        } else {
            return res.status(400).json({ 'error': 'Une erreur est survenue lors de la création' });
        }
    })
};

const updateAudience = async (req, res) => {
    /*  #swagger.tags = ['Public ciblé']

        #swagger.description = 'Modifier un public ciblé dans la base de données'

        #swagger.parameters['target'] = {description: "Dénomination du public ciblé"}
        #swagger.operationId['id'] = {description: "Dénomination du public ciblé"}

         #swagger.security = [{
            "JWT": []
        }]

        #swagger.responses[200] = { 
            description: 'Requête reussie, public ciblé correctement modifié dans la base de données.'}
        #swagger.responses[400] = {
             description: 'Mauvaise requête, les informations envoyées ne peuvent pas être traitées.'}
         #swagger.responses[403] = {
             description: 'Requête exécutée, accès interdit, token invalide.'}
        #swagger.responses[403] = {
             description: 'Requête exécutée, accès interdit, l\'utilisateur ne dispose pas des droits. (il n'est pas administrateur)'}
        #swagger.responses[404] = {
             description: 'Requête exécutée, utilisateur non-trouvé.'}
        #swagger.responses[500] = {
             description: 'Erreur interne.'}
    */
    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;

    const id = req.body.id;
    const target = req.body.target;

    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    Audience.findByIdAndUpdate(id, {
        $set: {
            target: target,
        }
    }, { new: true }, function (err, result) {
        if (err) {
            return res.status(500).json({ 'error': 'Echec de la modification' });
        } else {
            return res.status(200).json({ 'success': 'Modification réussie' });
        }
    })
};

const deleteAudience = async (req, res) => {
    /*  #swagger.tags = ['Public ciblé']

        #swagger.description = 'Effacer un public ciblé dans la base de données'

        #swagger.parameters['target'] = {description: "Dénomination du public ciblé"}
        #swagger.operationId['id'] = {description: "Dénomination du public ciblé"}

         #swagger.security = [{
            "JWT": []
        }]

        #swagger.responses[201] = { 
            description: 'Requête reussie, public ciblé correctement ajouté à la base de données.'}
        #swagger.responses[400] = {
             description: 'Mauvaise requête, les informations envoyées ne peuvent pas être traitées.'}
         #swagger.responses[403] = {
             description: 'Requête exécutée, accès interdit, token invalide.'}
        #swagger.responses[427] = {
             description: 'Requête exécutée, accès interdit, l\'utilisateur ne dispose pas des droits. (il n'est pas administrateur)'}
        #swagger.responses[426] = {
             description: 'Requête exécutée, utilisateur non-trouvé.'}
        #swagger.responses[500] = {
             description: 'Erreur interne.'}
    */

    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;

    const id = req.body.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe  pas' });
    Audience.findByIdAndDelete(id, (err, result) => {
        if (!err) {
            return res.status(200).json({ 'success': 'Public cible supprimé avec succès' });
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la suppression' });
        }
    })
}

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

module.exports = { getAudience, createAudience, updateAudience, deleteAudience };