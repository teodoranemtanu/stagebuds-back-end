const MODEL_PATH = '../models/';
const Like = require(MODEL_PATH + 'like');
const HttpError = require("../models/http-error");

const getAllPostLikes = async (postId) => {
    return await Like.find({post: postId});
};

const addLike = async (like) => {
    const newLike = new Like(like);
    await newLike.save();
    return newLike;
};

const removeLike = async (postId, userId) => {
    const like = await Like.findOneAndRemove({post: postId, author: userId});
    // console.log(like);
    return like;
};

exports.getAllPostLikes = getAllPostLikes;
exports.addLike = addLike;
exports.removeLike = removeLike;