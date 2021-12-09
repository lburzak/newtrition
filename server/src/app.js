const express = require('express');
const {provideAuthenticatedUser} = require('./requestHandlers/middleware/auth');
const {provideUserFromPath} = require("./requestHandlers/middleware/path");
const {getUserProducts, createProduct} = require("./requestHandlers/products");
const {getAuthenticatedUser} = require("./requestHandlers/users");
const {signUp, getToken} = require("./requestHandlers/auth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const authRouter = express.Router();
const usersRouter = express.Router();

app.use('/api/users', provideAuthenticatedUser, usersRouter);
app.use('/api/auth', authRouter)

usersRouter.get('/@me', getAuthenticatedUser);
usersRouter.get('/:username/products', provideUserFromPath, getUserProducts);
usersRouter.post('/:username/products', provideUserFromPath, createProduct);

authRouter.post('/signup', signUp);
authRouter.post('/', getToken);

module.exports = app;
