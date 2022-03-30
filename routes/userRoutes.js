const express = require('express');

const router = express.Router();

const {
    createUser,
    getUser,
    updateUser,
    // deleteUser,
} = require('../controllers/userController.js');

router.post('/register', createUser);
router.post('/login', getUser);
router.post('/updateUser', updateUser);
// router.post('/deleteUser', deleteUser);

module.exports = router;
