const HttpError = require('../models/http-error');
const MODEL_PATH = '../models/';
const User = require(MODEL_PATH + 'user');

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const getAllUsers = async () => {
    let users = await User.find({}, '-password');
    return users;
};

const findUserByEmail = async (email) => {
    let user = await User.findOne({email: email});
    return user;
};

const findUserById = async (uid) => {
    let user = await User.findById(uid);
    return user;
};

const findUsersByFirstName = async(firstName) => {
    let users = await User.find({firstName: firstName}, '-password -savedPosts');
    return users;
};

const findUsersByLastName = async (lastName) => {
    let users = await User.find({lastName: lastName}, '-password -savedPosts');
    return users;
};

const createUser = async (email, password, firstName, lastName) => {
    let hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
        email, password: hashedPassword, firstName, lastName
    });

    await createdUser.save();
    return createdUser;
};

const checkPassword = async (email, password) => {
    let existingUser = await findUserByEmail(email);
    return await bcrypt.compare(password, existingUser.password);
};

const createToken = (user) => {
    return jwt.sign({
            userId: user.id,
            email: user.email
        },
        'rubber-duck-debugging',
        {expiresIn: '1h'}
    );
};

const updateProfilePicture = async (userId, image) => {
    let user = await User.findByIdAndUpdate(userId, {profilePicture: image});
    return user;
};

const isCreator = (creatorId, userId) => {
    return creatorId === userId;
};

const findUserByName = async (firstName, lastName) => {
    const user = await User.findOne({firstName, lastName}, '-password -savedPosts');
    return user;
};

const savePost = async (userId, postId) => {
    const user = await User.findById(userId);
    await user.savedPosts.push(postId);
    await user.save();
    return user;
};

const unSavePost = async (userId, postId) => {
    const updatedUser = await User.findByIdAndUpdate(userId, {$pullAll: {savedPosts: [postId]}}, {
        new: true
    });
    return updatedUser;
};

const getUserSavedPostsWithData = async (userId) => {
    const user = await User.findById(userId).populate({
        path: 'savedPosts',
        populate: {
            path: 'author',
            select: {password: 0, email: 0, posts: 0, savedPosts: 0}
        }
    });
    return user;
};

exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.createToken = createToken;
exports.findUserByEmail = findUserByEmail;
exports.checkPassword = checkPassword;
exports.findUserById = findUserById;
exports.updateProfilePicture = updateProfilePicture;
exports.isCreator = isCreator;
exports.findUserByName = findUserByName;
exports.savePost = savePost;
exports.unSavePost = unSavePost;
exports.getUserSavedPostsWithData = getUserSavedPostsWithData;
exports.findUsersByFirstName = findUsersByFirstName;
exports.findUsersByLastName = findUsersByLastName;