const express = require('express');

const router = express.Router();

const {
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController.js');

router.post('/register', createUser);
router.post('/login', getUser);
router.put('/user', updateUser);
router.delete('/user', deleteUser);

module.exports = router;
