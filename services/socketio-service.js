const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const socketio = require('socket.io');
const notificationEndpoint = '/notifications';
const messageEndpoint = '/message';
const notificationService = require('./notification-service');

let userId;

const mainSocket = (io, socket) => {
    socket.on('clientAuth', (data) => {
        if (data.userId === checkAuth(data.token)) {
            userId = data.userId;
            socket.emit('goodAuth');
        } else {
            socket.disconnect(true);
        }
    });

    io.of('/notifications').on('connection', (nsSocket) => {
        console.log('conn');
        let notification;
        nsSocket.on('addLike', (data) => {
            try {
                const notification = notificationService.addNotification(data.userId, data.postId);
            } catch (err) {
                const error = new HttpError('Something went wrong with the notification', 505);
            }
            // socket.to(id).emit('my message', msg);
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

module.exports = mainSocket;
