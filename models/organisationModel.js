const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
    name: { type: String },
    date: { type: Date, default: Date.now },
});

const OrgModel = mongoose.model('organisations', OrgSchema);

module.exports = OrgModel;