const express = require('express');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const authenticate = require('./middleware/aunthenticate');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/users', authenticate, usersRouter);
app.use('/api/auth', authRouter)

module.exports = app;
