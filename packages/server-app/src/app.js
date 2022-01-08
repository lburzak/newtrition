const express = require('express');
const {provideAuthenticatedUser} = require('./requestHandlers/middleware/auth');
const {provideUserFromPath} = require("./requestHandlers/middleware/path");
const {getUserProducts, createProduct, getAvailableClasses, deleteProduct, getProductPhoto, replaceProduct, updateProduct
} = require("./requestHandlers/products");
const {getAuthenticatedUser} = require("./requestHandlers/users");
const {signUp, getToken} = require("./requestHandlers/auth");
const {createRecipe, getUserRecipes, deleteRecipe, getRecipePhoto, replaceRecipe} = require("./requestHandlers/recipes");
const ValidationService = require("./services/validationService");
const {buildValidationMiddleware} = require("./requestHandlers/middleware/validation");
const multer = require("multer");

const upload = multer({ dest: 'uploads/' })

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const authRouter = express.Router();
const usersRouter = express.Router();

const deserializeProduct = (req, res, next) => {
   req.body.nutritionFacts = JSON.parse(req.body.nutritionFacts);
   req.body.classes = JSON.parse(req.body.classes);
   next();
}

const deserializeRecipe = (req, res, next) => {
   req.body.steps = JSON.parse(req.body.steps);
   req.body.ingredients = JSON.parse(req.body.ingredients);
   next();
}

app.use('/api/users', provideAuthenticatedUser, usersRouter);
app.use('/api/auth', authRouter)
app.get('/api/products/classes', getAvailableClasses);
app.delete('/api/products/:id', provideAuthenticatedUser, deleteProduct);
app.patch('/api/products/:id', provideAuthenticatedUser, updateProduct);
app.put('/api/products/:id', upload.array('photos', 10), deserializeProduct, provideAuthenticatedUser, replaceProduct);
app.put('/api/recipes/:id', upload.array('photos', 10), deserializeRecipe, provideAuthenticatedUser, replaceRecipe);
app.delete('/api/recipes/:id', provideAuthenticatedUser, deleteRecipe);
app.get('/api/products/:id/photos/:photoId', getProductPhoto);
app.get('/api/recipes/:id/photos/:photoId', getRecipePhoto);

usersRouter.get('/@me', getAuthenticatedUser);
usersRouter.get('/:username/products', provideUserFromPath, getUserProducts);
usersRouter.post('/:username/products', upload.array('photos', 10), deserializeProduct, provideUserFromPath, buildValidationMiddleware(ValidationService.validateProduct), createProduct);
usersRouter.post('/:username/recipes', upload.array('photos', 10), deserializeRecipe, provideUserFromPath, buildValidationMiddleware(ValidationService.validateRecipe), createRecipe);
usersRouter.get('/:username/recipes', provideUserFromPath, getUserRecipes);

authRouter.post('/signup', buildValidationMiddleware(ValidationService.validateCredentials), signUp);
authRouter.post('/', getToken);

module.exports = app;
