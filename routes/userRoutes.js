const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const jwt = require('jsonwebtoken');

const {
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController.js');

router.post('/register', createUser);
router.post('/login', getUser);
router.put('/user', authenticateToken, updateUser);
router.delete('/user', authenticateToken, deleteUser);

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
