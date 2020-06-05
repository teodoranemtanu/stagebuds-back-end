const express = require('express');
const likesController = require('../controllers/likes-controller');
const authCheck = require('../middleware/chech-auth');

const router = express.Router();

router.use(authCheck);

router.get('/:pid', likesController.getAllPostLikes);
router.get('/liked/:pid', likesController.isPostLikedByUser);
router.post('/:pid', likesController.addLike);
router.delete('/:pid', likesController.removeLike);

module.exports = router;