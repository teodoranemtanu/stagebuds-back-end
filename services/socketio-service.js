const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const notificationService = require('./notifications-service');
const redisService = require('./redis-service');
const conversationsService = require('./conversations-service');
const messagesService = require('./messages-service');
const usersService = require('./users-service');

const mainSocket = (io, socket) => {
    redisService.initRedis()
        .then(redisClient => {
            socket.on('clientAuth', async (data) => {
                const userId = checkAuth(data.token);
                console.log(userId);
                if (userId !== null) {
                    redisClient.hset('socketIds', userId, socket.id);
                    console.log('socket connected', socket.id);
                    const initialNotifications = await notificationService.getUserNotificationsByUser(userId);
                    socket.emit('getNotifications', initialNotifications);
                } else {
                    console.log('disconnect');
                    socket.disconnect(true);
                }
            });
        });

    socket.on('addLike', async (data) => {
        let notification;
        try {
            notification = await notificationService.addNotification(data.userId, data.postId);
        } catch (err) {
            const error = new HttpError('Something went wrong with the notification', 505);
            console.log(error);
        }
        redisService.initRedis()
            .then(redisClient => {
                console.log(notification.receiver);
                redisClient.hgetall('socketIds', (err, result) => {
                    console.log('send notif to', result[notification.receiver]);
                });
                redisClient.hgetall('socketIds', (err, result) => {
                    socket.to(result[notification.receiver]).emit('newNotification', notification);
                })

            });
    });
};

const checkAuth = (token) => {
    try {
        if (!token) {
            throw new HttpError('Authentication failed', 401);
        }
        const decodedToken = jwt.verify(token, 'rubber-duck-debugging');
        return decodedToken.userId;
    } catch (err) {
        return new HttpError('Authentication failed', 401);
    }
};

const messengerSocket = async (io, socket) => {
    redisService.initRedis()
        .then(redisClient => {
            socket.on('getUserData', async (data) => {
                const userId = checkAuth(data.token);
                if (userId !== null) {
                    redisClient.hset('messSocketIds', userId, socket.id);
                    console.log('messenger socket connected');
                    const conversations = await conversationsService.getConversationsOfUser(userId);
                    socket.emit('initialConversations', conversations);
                } else {
                    console.log('disconnect');
                    socket.disconnect(true);
                }
            });
        });

    socket.on('conversationData', async (conversationId) => {
        const messages = await messagesService.getMessagesOfConversation(conversationId);
        console.log(messages);
        socket.emit('getConversationData', messages);
    });

    socket.on('newConversation', async (values) => {
        const firstName = values.firstUserName.split(' ')[0];
        const lastName = values.firstUserName.split(' ')[1];
        const user1 = await usersService.findUserByName(firstName, lastName);
        const user2 = values.secondUserId;
        let newConversation;
        try {
            newConversation = await conversationsService.createConversation(user1._id, user2);
            await newConversation
                .populate('user2', {password: 0, email: 0, posts: 0})
                .populate('user1', {password: 0, email: 0, posts: 0})
                .execPopulate();
        } catch (err) {
            return new HttpError('Something went wrong creating conversation', 505);
        }
        console.log(newConversation);
        socket.emit('getNewConversation', newConversation);
    });

    socket.on('sendMessage', (message) => {
        redisService.initRedis()
            .then(redisClient => {
                redisClient.hgetall('messSocketIds', async (err, result) => {
                    socket.to(result[message.receiver]).emit('newMessage', message);

                    const newMessage = await messagesService.createMessage(message);
                })
            });
    })
};

exports.mainSocket = mainSocket;
exports.messengerSocket = messengerSocket;
