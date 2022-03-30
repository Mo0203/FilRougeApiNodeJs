const express = require('express');

const router = express.Router();

const {
    createOrg,
    getOrgs,
    updateOrg,
    deleteOrg,
} = require('../controllers/organisationController.js');

router.post('/createOrg', createOrg);
router.get('/getOrgs', getOrgs);
router.post('/updateOrg', updateOrg);
router.post('/deleteOrg', deleteOrg);

module.exports = router;