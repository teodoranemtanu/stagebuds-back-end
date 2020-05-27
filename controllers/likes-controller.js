const likesService = require('../services/likes-service');
const HttpError = require('../models/http-error');

const getAllPostLikes = async (req, res, next) => {
    const postId = req.params.pid;
    let likes;
    try{
        likes = await likesService.getAllPostLikes(postId);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.json(likes.map(like => like.toObject({getters: true})))
};

const addLike = async (req, res, next) => {
    const postId = req.params.pid;
    const userId = req.userData.userId;
    const {timestamp} = req.body;

    let like;

    try{
        like = await likesService.addLike({post: postId, author: userId, timestamp});
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.status(201).json(like);
};

const removeLike = async (req, res, next) => {
    const postId = req.params.pid;
    const userId = req.userData.userId;
    let like;

    try{
        like = await likesService.removeLike(postId, userId);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.status(201).json({
        message: "Like removed"
    })
};

exports.getAllPostLikes = getAllPostLikes;
exports.addLike = addLike;
exports.removeLike = removeLike;