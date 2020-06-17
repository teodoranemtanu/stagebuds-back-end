const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {type: mongoose.Types.ObjectId, ref: 'User'},
    receiver: {type: mongoose.Types.ObjectId, ref: 'User'},
    text: {type: String, required: true},
    timestamp: {type: Date},
    conversation: {type: mongoose.Types.ObjectId, ref: 'Conversation'}
});

module.exports = mongoose.model('Message', messageSchema);