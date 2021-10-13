const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/users', usersRouter);

module.exports = app;
