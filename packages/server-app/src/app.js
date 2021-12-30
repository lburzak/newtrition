const express = require('express');
const {provideAuthenticatedUser} = require('./requestHandlers/middleware/auth');
const {provideUserFromPath} = require("./requestHandlers/middleware/path");
const {getUserProducts, createProduct, getAvailableClasses, deleteProduct} = require("./requestHandlers/products");
const {getAuthenticatedUser} = require("./requestHandlers/users");
const {signUp, getToken} = require("./requestHandlers/auth");
const {createRecipe, getUserRecipes, deleteRecipe} = require("./requestHandlers/recipes");
const ValidationService = require("./services/validationService");
const {buildValidationMiddleware} = require("./requestHandlers/middleware/validation");
const multer = require("multer");

const upload = multer({ dest: 'uploads/' })

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const authRouter = express.Router();
const usersRouter = express.Router();

app.use('/api/users', provideAuthenticatedUser, usersRouter);
app.use('/api/auth', authRouter)
app.use('/api/products/classes', getAvailableClasses);
app.use('/api/products/:id', provideAuthenticatedUser, deleteProduct);
app.delete('/api/recipes/:id', provideAuthenticatedUser, deleteRecipe);

usersRouter.get('/@me', getAuthenticatedUser);
usersRouter.get('/:username/products', provideUserFromPath, getUserProducts);
usersRouter.post('/:username/products', upload.array('photos', 10), provideUserFromPath, buildValidationMiddleware(ValidationService.validateProduct), createProduct);
usersRouter.post('/:username/recipes', provideUserFromPath, buildValidationMiddleware(ValidationService.validateRecipe), createRecipe);
usersRouter.get('/:username/recipes', provideUserFromPath, getUserRecipes);

authRouter.post('/signup', buildValidationMiddleware(ValidationService.validateCredentials), signUp);
authRouter.post('/', getToken);

module.exports = app;
