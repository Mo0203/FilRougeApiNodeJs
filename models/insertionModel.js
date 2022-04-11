const mongoose = require('mongoose');

const schemaInsertion = new mongoose.Schema({
    title: { type: String },
    financement: { type: String },
    organisation: { type: String },
    but: { type: String },
    age_max: { type: Number },
    age_min: { type: Number },
    Date: { type: Date },
    duree: { type: String },
    infosSup: { type: String },
    url: { type: String },
    remuneration: { type: String },
    id: { type: Number }

});

const insertionModel = mongoose.model('insertion', schemaInsertion);

module.exports = insertionModel;
