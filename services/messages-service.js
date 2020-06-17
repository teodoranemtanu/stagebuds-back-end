const Message = require('../models/message');

const getMessagesOfConversation = async (conversationId) => {
    const messages = await Message.find({conversation: conversationId});
    return messages;
};

const createMessage = async (message) => {
    const newMessage = new Message(message);
    await newMessage.save();
    return newMessage;
};

exports.getMessagesOfConversation = getMessagesOfConversation;
exports.createMessage = createMessage;