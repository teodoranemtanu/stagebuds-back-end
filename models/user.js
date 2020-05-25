const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 5},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    profilePicture: {type: String, required: false},
    posts: [{type: mongoose.Types.ObjectId, required: false, ref: 'Post'}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);