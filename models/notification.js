const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    sender: {type: mongoose.Types.ObjectId, required: true, ref:'User'},
    receiver: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    text: {type: String, required: true},
    timestamp: {type: Date},
    read: {type: Boolean},
    post: {type:mongoose.Types.ObjectId, ref:'Post'}
});

module.exports = mongoose.model('Notification', notificationSchema);