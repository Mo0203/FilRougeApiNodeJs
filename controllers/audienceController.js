const Audience = require('../models/audienceModel.js');
const ObjectId = require('mongoose').Types.ObjectId;

const getAudience = async(req, res) => {

    /*
    #swagger.tags = ['Public ciblé']
    #swagger.description = "Liste des publics ciblés présents dans la base de données."   
    #swagger.responses[200] = { 
            content : "application/json",
            schema:  {$ref: "#/definitions/audience"},
            description: 'Liste des dispositifs reçus avec succès.' 
    } 
    #swagger.responses[500] = {description: 'Une erreur serveur est survenue.'}          
    */

    const target = req.body.target;

    Audience.findOne({ target: target })
        .then((audience) => {
            if (!audience) {
                return res.status(204).json({ 'error': 'Aucune correspondance trouvée.' });
            } else {
                res.status(200).send(audience);
            }
        })
        .catch((err) => {
            return res.status(500).json({ 'error': 'Une erreur est survenue lors de la recherche.' });
        })
};

const createAudience = async(req, res) => {

    /*  
    #swagger.tags = ['Public ciblé']
    #swagger.description = "Ajouter un public ciblé dans la base de données." 
    #swagger.security = [{ "jwt" : [] }]
    #swagger.parameters['target'] = {
        in: 'body',
        required: true,
        description: 'Dénomination du public ciblé. (Exemple: sans emploi.)',
        type: 'string'
    }
    #swagger.responses[201] = { 
            content : "application/json",
            schema:  {$ref: "#/definitions/audience"},
            description: 'Public ciblé ajouté à la base de données avec succès.' 
    }      
    #swagger.responses[403] = {description: 'Token invalide.'}
    #swagger.responses[404] = {description: 'L\'utilisateur n\'a pas été trouvé dans la base de données.'}
    #swagger.responses[401] = {description: 'L\'utilisateur ne dispose pas de droits suffisants.'}
    #swagger.responses[500] = {description: 'Erreur lors de la sauvegarde des données.'}      
    #swagger.responses[500] = {description: 'Une erreur serveur est survenue.'} 
    
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
            return res.status(500).json({ 'error': 'Une erreur est survenue lors de la sauvegarde des données.' });
        }
    })
};

const updateAudience = async(req, res) => {

    /* 
   #swagger.tags = ['Public ciblé']
   #swagger.description = "Modifier un public ciblé dans la base de données." 
   #swagger.security = [{ "jwt" : [] }]
   #swagger.parameters['obj'] = {
       in: 'body',
       required: true,
       description: 'Données à modifier',
       schema: {
           id: 'id de l\'élément à modifier',
           target: 'dénomination du public ciblé (exemple: sans emploi)'
       }
   }
   #swagger.responses[201] = { 
           content : "application/json",
           schema:  {$ref: "#/definitions/audience"},
           description: 'Public cible modifié dans la base de données avec succès.' 
    }           
   #swagger.responses[403] = {description: 'Token invalide.'}
   #swagger.responses[404] = {description: 'L\'utilisateur n\'a pas été trouvé dans la base de données'}
   #swagger.responses[401] = {description: 'L\'utilisateur ne dispose pas des droits suffisants'}
   #swagger.responses[500] = {description: 'Une erreur serveur est survenue.'} 
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
    }, { new: true }, function(err, result) {
        if (err) {
            return res.status(500).json({ 'error': 'Echec de la modification' });
        } else {
            return res.status(200).json({ 'success': 'Modification réussie' });
        }
    })
};

const deleteAudience = async(req, res) => {

    /*  
    #swagger.tags = ['Public ciblé']
    #swagger.description = 'Effacer le public ciblé dans la base de données grâce à son id.'
    #swagger.parameters['id'] = {description: "Id de l\'élément à supprimer."}
    #swagger.security = [{"jwt": []}]
    #swagger.responses[201] = {description: 'Requête reussie, public ciblé correctement ajouté à la base de données.'}
    #swagger.responses[400] = {description: 'Mauvaise requête, les informations envoyées ne peuvent pas être traitées.'}
    #swagger.responses[403] = {description: 'Requête exécutée, accès interdit, token invalide.'}
    #swagger.responses[401] = {description: 'Requête exécutée, accès interdit, l\'utilisateur ne dispose pas des droits. (Il n\'est pas administrateur.).'}
    #swagger.responses[404] = {description: 'Requête exécutée, utilisateur non-trouvé.'}
    #swagger.responses[500] = {description: 'Erreur interne.'}
    */


    const userId = verifyToken(req, res);
    if (userId == null) return res;
    if (adminCheck(userId) == false) return res;

    const id = req.body.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ 'error': 'L\'ID spécifié n\'existe pas.' });
    Audience.findByIdAndDelete(id, (err, result) => {
        if (!err) {
            return res.status(200).json({ 'success': 'Public cible supprimé avec succès.' });
        } else {
            return res.status(500).json({ 'error': 'Erreur lors de la suppression.' });
        }
    })
    return false;
}

// fonction de vérification de la validité du token, renvoie null si erreur
function verifyToken(req, res) {
    try {
        jwt.verify(req.headers['authorization'], process.env.TOKEN_SECRET, function(tokenErr, decoded) {
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
    User.findById(userId, function(err, result) {
        if (err) {
            res.status(404).json({ 'error': 'Utilisateur introuvable.' });
        } else {
            if (result.isAdmin) {
                return true;
            } else {
                res.status(401).json({ 'error': 'Vous ne disposez pas des droits.' });
            }
        }
    })
    return false;
}


module.exports = { getAudience, createAudience, updateAudience, deleteAudience };