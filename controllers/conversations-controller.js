const conversationService = require('../services/conversations-service');
const HttpError = require('../models/http-error');

const createConversation = async (req, res, next) => {
    let {user2} = req.body;
    let user1 = req.userData.userId;
    let existingConversation;

    try {
        existingConversation = await conversationService.haveExistingConversation(user1, user2);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }

    if (existingConversation !== -1) {
        return res.status(201).json({
            message: 'Existing conversation',
            conversation: existingConversation
        });
    }

    let newConversation;
    try {
        newConversation = await conversationService.addConversation({user1, user2});
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }

    res.status(201).json({
        message: 'Created conversation',
        conversation: newConversation
    });
};

exports.createConversation = createConversation;