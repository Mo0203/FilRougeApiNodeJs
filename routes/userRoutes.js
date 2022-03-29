const express = require('express');
const router = express.Router();

const {
    getUser,
    createUser,
    // updateUser,
    // deleteUser,
} = require('../controllers/userController.js');

router.post('/login', getUser);
router.post('/register', createUser);
// router.post('/updateUser', updateUser);
// router.post('/deleteUser', deleteUser);

module.exports = router;
