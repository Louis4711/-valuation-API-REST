const express = require('express');
const router = express.Router();
const authController = require('./../controllers/auth.controller.js');
const { auth } = require('./../middlewares/auth.middleware.js');
const { limiter } = require('./../middlewares/limiter.middleware.js');


router.post('/register', authController.register);
router.post('/login', limiter(15, 30), authController.login);
router.get('/me', auth, authController.me);
router.post('/logout', auth, authController.logout);

module.exports = router;
