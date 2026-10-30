const express = require('express');

const authRoutes = require('./server/routes/auth.routes.js');
const createPostsRouter = require('./server/routes/posts.route.js');
const { auth } = require('./server/middlewares/auth.middleware.js');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/posts', createPostsRouter(auth));

module.exports = app;