const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {type: mongoose.Types.ObjectId, required: true, ref:'User'},
    receiver: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    text: {type: String, required: true},
    timestamp: {type: Date}
});

module.exports = mongoose.model('Message', messageSchema);