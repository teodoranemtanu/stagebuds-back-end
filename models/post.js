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
            type: Date, required: true
        },
        coordinates: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        },
        location: {
            type: String, required: true
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    timestamp: {
        type: Date, required: true
    },
    description: {
        type: String, required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Like'
    }]
});

module.exports = mongoose.model('Post', postSchema);