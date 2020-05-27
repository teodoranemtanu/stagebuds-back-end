const mongoose = require('mongoose');

const MODEL_PATH = '../models/' ;
const Profile = require(MODEL_PATH + 'profile');
const Post = require(MODEL_PATH + 'post');
const User = require(MODEL_PATH + 'user');
const Like = require(MODEL_PATH + '/like');
const HttpError = require("../models/http-error");

const createPost = async (post) => {
    const createdPost = new Post(post);

    console.log(createdPost);

    const session = await mongoose.startSession();
    session.startTransaction();
    createdPost.save();
    const user = await User.findById(createdPost.author);
    user.posts.push(createdPost.id);
    await user.save({session});
    await session.commitTransaction();
    session.endSession();
    return createdPost;
};

const getAllPosts = async () => {
    const posts = await Post.find().populate('author',  {password: 0, email: 0});
    return posts;
};

const getPost = async (postId) => {
    const post = await Post.findById(postId).populate('author',  {password: 0, email: 0});
    return post;
};

const getAllPostsByUser = async (userId) => {
  const posts = await Post.find({author: userId}).populate('author',  {password: 0, email: 0});
  return posts;
};

const updatePost = async (userId, postId, concertDetails, text) => {
    let post = await Post.findById(postId);

    if(post.author.toString() !== userId) {
        throw new HttpError("User is not allowed to edit this post", 401);
    }

    let updatedPost = await Post.findByIdAndUpdate(postId, {
        concertDetails, text
    }, {
        new: true
    });

    return updatedPost;
};

const deletePost = async (userId, postId) => {
    let postToDelete = await Post.findById(postId);

    if(postToDelete.author.toString() !== userId) {
        throw new HttpError("User is not allowed to edit this post", 401);
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    let deletedPost = await Post.findByIdAndRemove(postId, {session});
    const user = await User.findById(userId);
    user.posts.pull(postId);
    await user.save({session});
    let deletedLikes = await Like.remove({post: postId});
    await session.commitTransaction();
    session.endSession();
    return deletedPost;
};

exports.getAllPosts = getAllPosts;
exports.getAllPostsByUser = getAllPostsByUser;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getPost = getPost;