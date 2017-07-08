const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController')
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(planController.explore))
router.get('/addPlan',
  authController.isLoggedIn,
  planController.addPlan
);

router.post('/addPlan',
  planController.upload,
  catchErrors(planController.resize),
  catchErrors(planController.createPlan)
);

router.post('/addPlan/:id',
  authController.isLoggedIn,
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
  authController.Registerlogin
);
router.get('/logout', authController.logout)
router.get('/auth/facebook', authController.authFacebook);
router.get('/auth/facebook/callback', authController.facebookCallback);

router.get('/account', authController.isLoggedIn, catchErrors(userController.account));
router.get('/account/edit', authController.isLoggedIn, userController.accountEdit);
router.post('/account/edit',
  userController.upload,
  catchErrors(userController.resize),
  catchErrors(userController.updateAccount));
router.get('/account/addProfileInfo', authController.isLoggedIn, userController.accountAddProfileInfo);


router.post('/reviews/:id',
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);

//API
router.get('/api/plans/near', catchErrors(planController.mapPlans))
router.post('/api/plans/:id/heart', catchErrors(planController.heartPlan))
router.post('/api/plans/:id/done', catchErrors(planController.donePlan))

module.exports = router;
