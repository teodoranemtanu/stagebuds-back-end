const {validationResult} = require('express-validator');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error')
const User = require('../models/user');
const usersService = require('../services/users-service');


const getUsers = async (req, res, next) => {
    console.log('get');
    let users;
    try{
        users = await usersService.getAllUsers();
    }catch (err) {
        const error = new HttpError(err.message, err.errorCode)
        return next(error);
    }
    res.json(users.map(user => user.toObject({getters: true})));
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.'));
    }

    const {email, password, firstName, lastName} = req.body;

    let existingUser;
    try{
        existingUser = await usersService.findUserByEmail(email);
    }catch (err) {
        const error = new HttpError("Signing up failed, please try again later", 500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError(
            "User exists already, please login instead",
            422
        );
        return next(error);
    }

    let createdUser;
    try {
        createdUser = await usersService.createUser(email, password, firstName, lastName);
    } catch (err){
        const error = new HttpError("Creating user failed, please try again", 500);
        return next(error);
    }

    let token;
    try{
        token = usersService.createToken(createdUser.id, createdUser.email);
    }catch (err){
        const error = new HttpError("Signing up failed, please try again later", 500);
        return next(error);
    }

    res.status(201)
    .json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token
    });
};


const login = async (req, res, next) => {
    const {email, password} = req.body;
    let validCredentials;
    let token;
    let user;

    try {
        validCredentials = await usersService.checkPassword(email, password);
    } catch (err){
        return next(new HttpError('Invalid credentials, please check your inputs.', 401));
    }

    if(validCredentials){
        try{
            user = await usersService.findUserByEmail(email);
            token = await usersService.createToken(user);
        }  catch(err){
            const error = new Error("Logging in failed, please try again later", 500);
            return next(error);
        }
    } else {
        const error = new HttpError("Invalid credentials, could not log in", 401);
        return next(error);
    }

    res.status(201)
        .json({
            userId: user.id,
            email: user.email,
            token
        })
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;