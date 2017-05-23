const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController')
const userController = require('../controllers/userController')

router.get('/', planController.landingPage)

// user routes
router.get('/login', userController.loginForm)

module.exports = router;
