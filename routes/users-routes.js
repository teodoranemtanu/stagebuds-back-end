const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');
const {dataUri, multerUploads} = require("../middleware/multer");
const authCheck = require('../middleware/chech-auth');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

router.get('/:uid', usersController.getUser);

router.post('/uploadImage', authCheck, multerUploads, usersController.uploadImage);

module.exports = router;