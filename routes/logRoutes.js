const express = require('express');
const router = express.Router();


const {
    getLogs,
    getLog,
    getLogByUser,
    //deleteLog,

} = require('../controllers/logController.js');

router.get('/log', getLogs);
router.post('/log', getLog);
router.post('/logByUser', getLogByUser);
router.deleteLog('/log', deleteLog);


module.exports = router;