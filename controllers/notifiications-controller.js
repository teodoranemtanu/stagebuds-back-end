const notificationsService = require('../services/notifications-service');
const HttpError = require('../models/http-error');

const markRead = async (req, res, next) => {
    const notifications = req.body;
    try {
        notifications.forEach(async (obj) => {
            if (obj.read === false) {
                const readNotification = await notificationsService.markNotificationRead(obj._id);
            }
        });
    } catch (err) {
        const error = new HttpError(err.message, err.statusCode);
        return next(error);
    }
    await res.json({
        message: 'notifications read'
    });
};

exports.markRead = markRead;