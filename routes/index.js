const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', planController.explore)
router.get('/addPlan', planController.addPlan)
router.post('/addPlan', catchErrors(planController.createPlan))

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
