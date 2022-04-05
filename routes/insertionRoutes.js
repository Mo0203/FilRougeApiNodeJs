const express = require('express');

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
router.post('/insertion', createInsertion);
router.delete('/insertion', deleteInsertion);
router.put('/insertion', updateInsertion);
router.post('/insertionByAge', getInsertionByAge);
router.post('/insetionByOrganisation', getByOrganisation);

module.exports = router;