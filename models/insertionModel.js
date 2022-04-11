const mongoose = require('mongoose');

const InsertionSchema = new mongoose.Schema({
    title: { type: String },
    min_age: { type: String },
    max_age: { type: String },
    income: { type: String },
    creation_date: { type: Date, default: Date.now },
    url: { type: String },
    audience: { type: String },
    duration: { type: String },
    funding: { type: String },
    organisation: { type: String },
    goal: { type: String },
    info: { type: String }
});

const InsertionModel = mongoose.model('insertions', InsertionSchema);

module.exports = InsertionModel;
