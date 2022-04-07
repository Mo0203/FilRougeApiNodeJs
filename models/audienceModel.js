const mongoose = require('mongoose');

const AudienceSchema = new mongoose.Schema({
    target: { type: String }
});

const AudienceModel = mongoose.model('audiences', AudienceSchema);

module.exports = AudienceModel;