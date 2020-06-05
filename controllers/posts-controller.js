const HttpError = require('../models/http-error');
const postsService = require('../services/posts-service');
const locationService = require('../services/location-service');

const getAllPosts = async (req, res, next) => {
    let posts;
    try {
        posts = await postsService.getAllPosts();
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.json(posts.map(post => post.toObject({getters: true})))
};

const getPost = async (req, res, next) => {
    let post;
    const postId = req.params.pid;
    try{
        post = await postsService.getPost(postId);
        if(post == null){
            throw new HttpError("You're looking for a post that does not exist", 505);
        }
    }catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.json(post.toObject({getters: true}));
};

const getAllPostsByUser = async (req, res, next) => {
    const userId = req.params.uid;
    let posts;
    try {
        posts = await postsService.getAllPostsByUser(userId);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.json(posts.map(post => post.toObject({getters: true})));
};

const createPost = async (req, res, next) => {
    let {concertDetails, description, timestamp} = req.body;
    let createdPost;
    let coordinates;

    try {
        coordinates = await locationService.getCoords(concertDetails.location);
        console.log(coordinates);
    } catch (error) {
        return next(error);
    }

    const concertDetailsWithCoordinates = {
        title: concertDetails.title,
        band: concertDetails.band,
        date: concertDetails.date,
        location: concertDetails.location,
        coordinates: coordinates
    };

    console.log(concertDetailsWithCoordinates, req.userData.userId, timestamp, description);

    try {
        createdPost = await postsService.createPost({
            concertDetails: concertDetailsWithCoordinates, author: req.userData.userId, timestamp, description: description
        });
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    res.status(201).json({
        message: 'Created post',
        post: createdPost
    })
};

const updatePost = async (req, res, next) => {
    const postId = req.params.pid;
    const userId = req.userData.userId;
    const {concertDetails, description} = req.body;
    let post;

    try {
        post = await postsService.updatePost(userId, postId, concertDetails, description);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.json(post.toObject({getters: true}));
};

const deletePost = async (req, res, next) => {
    const postId = req.params.pid;
    const userId = req.userData.userId;

    try {
        await postsService.deletePost(userId, postId);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }

    await res.status(201).json({
        message: 'Post deleted successfully'
    });
};

exports.getAllPosts = getAllPosts;
exports.getAllPostsByUser = getAllPostsByUser;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getPost = getPost;