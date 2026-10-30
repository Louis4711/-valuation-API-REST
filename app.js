const express = require('express');
const app = express();
const authRoutes = require('./server/routes/auth.routes.js');

app.use(express.json());

app.use('/api/auth', authRoutes);

module.exports = app;