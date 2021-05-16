const express = require('express');

const router = express.Router();

const userController = require('../controllers/user/user.controller');
const userValidator = require('../controllers/user/user.validator');

const {
  authentication,
  authorization,
} = require('../middleware/middleware');

router.post('/register', userValidator.registerValidator, userController.register);
router.post('/login', userValidator.loginValidator, userController.login);
router.get('/profile', authentication, authorization, userController.profile);
router.get('/users', authentication, authorization, userController.getAll);
router.get('/users/:id', authentication, authorization, userController.findById);

module.exports = router;
