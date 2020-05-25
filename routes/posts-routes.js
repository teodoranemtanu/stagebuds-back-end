const express = require('express');
const postsController = require('../controllers/posts-controller');
const authCheck = require('../middleware/chech-auth');

const router = express.Router();

router.use(authCheck);

router.get('/', postsController.getAllPosts);

router.post('/', postsController.createPost);

router.get('/:pid', postsController.getPost);

router.get('/:uid', postsController.getAllPostsByUser);

router.put('/:pid', postsController.updatePost);

router.delete('/:pid', postsController.deletePost);

module.exports = router;