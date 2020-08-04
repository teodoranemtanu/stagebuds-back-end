const MODEL_PATH = '../models/';
const Notification = require('../models/notification');
const HttpError = require("../models/http-error");
const Post = require('../models/post');
const User = require('../models/user');

const getUserNotificationsByUser = async (userId) => {
    const notifications = await Notification.find({receiver: userId}).limit(10).sort({timestamp: -1});
    return notifications;
};

const addNotification = async (userId, postId) => {
    const sender = userId;
    const senderUser = await User.findById(userId, 'firstName lastName');
    const post = await Post.findById(postId);
    const receiver = post.author;
    const read = false;
    const timestamp = Date.now();
    const text = `${senderUser.firstName} ${senderUser.lastName} liked your post.`;

    const newNotification = new Notification({
        sender, receiver, timestamp, text, post: postId, read
    });


    await newNotification.save();

    return newNotification;
};

const markNotificationRead = async (notificationId) => {
    let notification = await Notification.findByIdAndUpdate(notificationId, {read: true}, {
        new: true
    });
    return notification;
};
exports.getUserNotificationsByUser = getUserNotificationsByUser;
exports.addNotification = addNotification;
exports.markNotificationRead = markNotificationRead;