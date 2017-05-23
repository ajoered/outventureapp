const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

router.get('/', planController.landingPage)

// user routes
router.get('/login', userController.loginForm)
router.post('/login', authController.login);
router.get('/register', userController.registerForm)
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout)

module.exports = router;
