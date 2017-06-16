const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(planController.explore))
router.get('/addPlan', authController.isLoggedIn, planController.addPlan)

router.post('/addPlan',
  planController.upload,
  catchErrors(planController.resize),
  catchErrors(planController.createPlan)
);

router.post('/addPlan/:id',
  planController.upload,
  catchErrors(planController.resize),
  catchErrors(planController.updatePlan)
);

router.get('/plans/:id/edit', catchErrors(planController.editPlan))
router.get('/plans/:slug', catchErrors(planController.getPlanBySlug))

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

router.get('/account', authController.isLoggedIn, catchErrors(userController.account));
router.get('/account/edit', authController.isLoggedIn, userController.accountEdit);
router.post('/account/edit', catchErrors(userController.updateAccount));

//API
router.get('/api/plans/near', catchErrors(planController.mapPlans))

router.post('/api/plans/:id/heart', catchErrors(planController.heartPlan))

module.exports = router;
