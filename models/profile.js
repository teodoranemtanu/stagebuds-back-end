const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    description: String,
    bands: [String],
    genres: [String],
    concerts: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Profile', profileSchema);