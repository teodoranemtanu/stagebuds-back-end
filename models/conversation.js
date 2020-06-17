const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    user1: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    user2: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
});

module.exports = mongoose.model('Conversation', conversationSchema);