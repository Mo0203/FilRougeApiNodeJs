const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {
    getInsertions,
    getInsertionByAge,
    getByOrganisation,
    createInsertion,
    deleteInsertion,
    updateInsertion,
} = require('../controllers/insertionController.js');

router.get('/insertion', getInsertions);
router.post('/insertion', authenticateToken, createInsertion);
router.delete('/insertion', authenticateToken, deleteInsertion);
router.put('/insertion', authenticateToken, updateInsertion);
router.post('/insertionByAge', getInsertionByAge);
router.post('/insetionByOrganisation', getByOrganisation);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    //const token = authHeader && authHeader.split(' ')[1]
    const token = req.headers['authorization'];// récupère le token dans le header de la requête
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

module.exports = router;