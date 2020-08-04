const express = require('express');
const notificationsController = require('../controllers/notifiications-controller');
const authCheck = require('../middleware/chech-auth');
const router = express.Router();

router.use(authCheck);
router.put('/', notificationsController.markRead);

module.exports = router;

