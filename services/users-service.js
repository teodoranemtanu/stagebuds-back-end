const HttpError = require ('../models/http-error');
const MODEL_PATH = '../models/' ;
const User = require(MODEL_PATH + 'user');

const bcrypt = require ("bcryptjs");
const jwt = require('jsonwebtoken');

const getAllUsers = async () => {
    let users = await User.find({}, '-password');
    return users;
};

const findUserByEmail = async (email) => {
    let users = await User.findOne({email: email});
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
        {expiresIn : '1h'}
    );
};

exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.createToken = createToken;
exports.findUserByEmail = findUserByEmail;
exports.checkPassword = checkPassword;