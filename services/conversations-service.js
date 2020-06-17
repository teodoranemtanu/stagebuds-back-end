const MODEL_PATH = '../models/';
const Conversation = require(MODEL_PATH + 'conversation');
const HttpError = require("../models/http-error");

const getConversationsOfUser = async (userId) => {
    const conversations1 = await Conversation.find({user1: userId})
        .populate('user2',  {password: 0, email: 0, posts:0})
        .populate('user1', {password: 0, email: 0, posts:0});
    const conversations2 = await Conversation.find({user2: userId})
        .populate('user1', {password: 0, email: 0, posts:0})
        .populate('user2', {password: 0, email: 0, posts:0});
    return [
        ...conversations1,
        ...conversations2
    ];
};

const addConversation = async (conversation) => {
    const newConversation = new Conversation(conversation);
    await newConversation.save();
    return newConversation;
};

const haveExistingConversation = async (user1, user2) => {
    const conversation1 = await Conversation.findOne({user1: user1, user2: user2});
    const conversation2 = await Conversation.findOne({user1: user2, user2: user1});
    if(conversation1 !== null) {
        return conversation1;
    } else if (conversation2 !== null) {
        return conversation2;
    } else {
        return -1;
    }
};

exports.getConversationsOfUser = getConversationsOfUser;
exports.haveExistingConversation = haveExistingConversation;
exports.addConversation = addConversation;