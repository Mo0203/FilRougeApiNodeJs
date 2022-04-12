const express = require('express');
const router = express.Router();

const {
    createAudience,
    getAudience,
    updateAudience,
    deleteAudience,
} = require('../controllers/audienceController.js');

router.post('/audience', createAudience);
router.get('/audience', getAudience);
router.put('/audience', updateAudience);
router.delete('/audience', deleteAudience);

module.exports = router;