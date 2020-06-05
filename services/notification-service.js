const MODEL_PATH = '../models/';
const Notification = require(MODEL_PATH + 'like');
const HttpError = require("../models/http-error");
const Post = require('../models/post');
const User = require('../models/user');

const getUserNotifications = async (userId) => {
    const notifications = await Notification.find({receiver: userId}).
                                limit(10).
                                sort({ timestamp: -1 });
    return notifications;
};

const addNotification = async (userId, postId) => {
    const sender = userId;
    const senderUser = User.findById(userId);
    const receiver = Post.findById(postId).author;
    const timestamp = Date.now();
    const text = `${senderUser.firstName} ${senderUser.lastName} liked your post.`

    const newNotification =  new Notification({
        sender, receiver, timestamp, text, post: postId
    });

    await newNotification.save();
    return newNotification;
};

exports.getUserNotifications = getUserNotifications;
exports.addNotification = addNotification;