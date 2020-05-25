const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    concertDetails: {
        title: {
            type: String, required: true
        },
        band: {
            type: String, required: true
        },
        date: {
            type: Date
        },
        location: {
            lat: {
                type: Number, required: true
            },
            lng: {
                type: Number, required: true
            }
        },
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    timestamp: {
        type: Date, required: true
    },
    text: {
        type: String, required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Like'
    }]
});

module.exports = mongoose.model('Post', postSchema);