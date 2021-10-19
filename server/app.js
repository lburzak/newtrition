const express = require('express');
const usersRouter = require('./src/routes/users');
const authRouter = require('./src/routes/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter)

module.exports = app;
