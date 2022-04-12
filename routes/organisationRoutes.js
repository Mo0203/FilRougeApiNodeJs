const express = require('express');

const router = express.Router();

const {
    createOrg,
    getOrgs,
    updateOrg,
    deleteOrg,
} = require('../controllers/organisationController.js');

router.post('/organisation', createOrg);
router.get('/organisation', getOrgs);
router.put('/organisation', updateOrg);
router.delete('/organisation', deleteOrg);

module.exports = router;