const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    action: { type: String },
    date: { type: Date, default: Date.now }
});

const LogModel = mongoose.model('logs', LogSchema);

module.exports = LogModel;