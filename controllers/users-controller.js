const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error')
const usersService = require('../services/users-service');
const profileService = require('../services/profiles-service');
const {dataUri} = require("../middleware/multer");
const cloudinary = require('cloudinary').v2;

const getUsers = async (req, res, next) => {
    console.log('get');
    let users;
    try {
        users = await usersService.getAllUsers();
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode)
        return next(error);
    }
    await res.json(users.map(user => user.toObject({getters: true})));
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.'));
    }

    const {email, password, firstName, lastName} = req.body;

    let existingUser;
    try {
        existingUser = await usersService.findUserByEmail(email);
    } catch (err) {
        const error = new HttpError("Signing up failed, please try again later", 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            "User exists already, please login instead",
            422
        );
        return next(error);
    }

    let createdUser, createdProfile;
    try {
        createdUser = await usersService.createUser(email, password, firstName, lastName);
        const createdUserId = createdUser._id.toString();
        createdProfile = await profileService.createProfile(createdUserId);
    } catch (err) {
        const error = new HttpError("Creating user failed, please try again", 500);
        return next(error);
    }

    let token;
    try {
        token = usersService.createToken(createdUser);
    } catch (err) {
        const error = new HttpError("Signing up failed, please try again later", 500);
        return next(error);
    }

    res.status(201)
        .json({
            userId: createdUser.id,
            email: createdUser.email,
            token: token
        });
};

const login = async (req, res, next) => {
    const {email, password} = req.body;
    let validCredentials;
    let token;
    let user;

    try {
        validCredentials = await usersService.checkPassword(email, password);
    } catch (err) {
        return next(new HttpError('Invalid credentials, please check your inputs.', 401));
    }

    if (validCredentials) {
        try {
            user = await usersService.findUserByEmail(email);
            token = await usersService.createToken(user);
        } catch (err) {
            const error = new HttpError("Logging in failed, please try again later", 500);
            return next(error);
        }
    } else {
        const error = new HttpError("Invalid credentials, could not log in", 401);
        return next(error);
    }

    res.status(201)
        .json({
            userId: user.id,
            email: user.email,
            token
        })
};

const getUser = async (req, res, next) => {
    const uid = req.params.uid;
    const user = await usersService.findUserById(uid);

    res.status(201)
        .json({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profilePicture
        })
};

const uploadImage = async (req, res, next) => {
    if (!req.file) {
        const error = new HttpError(
            "File was not valid",
            400
        );
        return next(error);
    }

    const file = dataUri(req).content;

    let image;
    try {
        let result = await cloudinary.uploader.upload(file, {
            folder: 'stage-buds',
            use_filename: true
        });
        image = result.url;
    } catch (err) {
        const error = new HttpError("Something went wrong uploading your photo", 400);
        return next(error);
    }

    try {
        const user = await usersService.updateProfilePicture(req.userData.userId, image);
        console.log(user.profilePicture);
    } catch (err) {
        const error = new HttpError("Something is wrong with your user data", 400);
        return next(error);
    }

    res.status(201).json({
        message: "Uploaded photo",
        data: image
    })
};

const savePostToUser = async (req, res, next) => {
    const postId = req.body.postId;
    const userId = req.userData.userId;
    let updatedUser;
    try {
        updatedUser = await usersService.savePost(userId, postId);
    }catch (err) {
        return next(new HttpError(err.message, err.statusCode))
    }
    res.status(201).json({
        savedPosts: updatedUser.savedPosts
    })
};

const unSavePostToUser = async (req, res, next) => {
    const postId = req.body.postId;
    const userId = req.userData.userId;
    let updatedUser;
    try {
        updatedUser = await usersService.unSavePost(userId, postId);
    }catch (err) {
        return next(new HttpError(err.message, err.statusCode))
    }
    res.status(201).json({
        savedPosts: updatedUser.savedPosts
    })
};

const getUserSavedPosts = async (req, res, next) => {
    const userId = req.userData.userId;
    console.log('userid', userId);
    let user;
    try {
        user = await usersService.findUserById(userId);
    } catch (err) {
        return next(new HttpError(err.message, err.statusCode))
    }
    console.log(user);
    res.status(201).json({
        savedPosts: user.savedPosts
    });
};

const getUserSavedPostsData = async (req, res, next) => {
    const userId = req.userData.userId;
    console.log('userid', userId);
    let user;
    try {
        user = await usersService.getUserSavedPostsWithData(userId);
    } catch (err) {
        return next(new HttpError(err.message, err.statusCode))
    }
    console.log(user.savedPosts);
    res.status(201).json({
        savedPosts: user.savedPosts
    });
};

const findUsers = async (req, res, next) => {
    const input = req.body;
    const splitInput = input.value.split(' ');
    let users = [];
    if(splitInput.length === 1) {
        let resultsByFirstName = await usersService.findUsersByFirstName(splitInput[0]);
        let resultsByLastName = await usersService.findUsersByLastName(splitInput[0]);
        users = [...users, ...resultsByFirstName, ...resultsByLastName];
    } else {
        let resultsByFirstName = await usersService.findUserByName(splitInput[0], splitInput[1]);
        let resultsByLastName = await usersService.findUserByName(splitInput[1], splitInput[0]);
        if(resultsByFirstName)
            users = [...users, resultsByFirstName];
        if(resultsByLastName)
            users = [...users, resultsByLastName];
    }
    res.status(201).json({
        searchResults: users
    });
};

exports.getUsers = getUsers;
exports.findUsers = findUsers;
exports.savePostToUser = savePostToUser;
exports.unSavePostToUser = unSavePostToUser;
exports.signup = signup;
exports.login = login;
exports.uploadImage = uploadImage;
exports.getUser = getUser;
exports.getUserSavedPosts = getUserSavedPosts;
exports.getUserSavedPostsData = getUserSavedPostsData;