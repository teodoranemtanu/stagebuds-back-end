const express = require('express');
const profilesController = require('../controllers/profiles-controller');
const authCheck = require('../middleware/chech-auth');

const router = express.Router();

router.use(authCheck);

router.get('/', profilesController.getAllProfiles);

router.get('/:uid', profilesController.getUserProfile);

router.put('/:uid', profilesController.updateProfile);

module.exports = router;