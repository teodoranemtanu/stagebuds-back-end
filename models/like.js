const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');

const likeSchema = new Schema({
    post: {
        type: mongoose.Types.ObjectId, ref: 'Post', required: true
    },
    author: {
        type: mongoose.Types.ObjectId, ref: 'User', required: true
    },
    timestamp: {
        type: Date, required: true
    }
});

likeSchema.post('findOneAndRemove', async document => {
    const postId = document.post;
    const post = await Post.findById(postId);
    post.likes.pull(document);
    await post.save();
});

likeSchema.post('save', async document => {
    const postId = document.post;
    const post = await Post.findById(postId);
    post.likes.push(document);
    await post.save();
});

module.exports = mongoose.model('Like', likeSchema);