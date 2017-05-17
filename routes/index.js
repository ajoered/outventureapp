const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController')


router.get('/', planController.landingPage)

module.exports = router;
