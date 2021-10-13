const express = require('express');
const usersRouter = require('./src/routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/users', usersRouter);

module.exports = app;
