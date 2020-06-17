const express = require('express');
const conversationsController = require('../controllers/conversations-controller');
const authCheck = require('../middleware/chech-auth');

const router = express.Router();

router.use(authCheck);

router.post('/', conversationsController.createConversation);

module.exports = router;