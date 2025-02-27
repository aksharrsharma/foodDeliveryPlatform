const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignup, validateLogin, validateResult} = require('../middlewares/validator');

// const offerRoutes = require('./offerRoutes'); // reference the controllers file so we can use its methods

const router = express.Router();

router.get('/new', isGuest, controller.new);

router.post('/', isGuest, validateSignup, validateResult, controller.create);

router.get('/login', isGuest, controller.show);
router.post('/login', logInLimiter, isGuest, validateLogin, validateResult, controller.processLogin);

router.get('/profile', isLoggedIn, controller.profile);
router.get('/profile', isLoggedIn, controller.profile);

router.get('/logout', isLoggedIn, controller.logout);

// router.use('/profile/offers', offerRoutes);

module.exports = router;