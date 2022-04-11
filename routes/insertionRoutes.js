const express = require('express');

const router = express.Router();

const {
    createIns,
    getIns,
    updateIns,
    deleteIns,
} = require('../controllers/insertionController.js');

router.post('/createIns', createIns);
router.get('/getIns', getIns);
router.post('/updateIns', updateIns);
router.post('/deleteIns', deleteIns);


module.exports = router;