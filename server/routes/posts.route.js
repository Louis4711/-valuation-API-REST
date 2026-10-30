const express = require('express');
const postsController = require('../controllers/posts.controller.js');

module.exports = (authMiddleware) => {
    const router = express.Router();

    router.get('/', postsController.getPosts);

    router.post(
        '/',
        authMiddleware,
        postsController.createPost
    );

    return router;
};