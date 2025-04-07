const express = require('express');
const controller = require('../controllers/profileController');
const {isGuest, isLoggedIn, isNotAdmin} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignup, validateLogin, validateResult} = require('../middlewares/validator');
const router = express.Router();

// get all orders associated with the user
router.get('/mycart', isLoggedIn, isNotAdmin, controller.displayUserCart);

// Add new route for cart count
router.get('/mycart/count', isLoggedIn, controller.getCartCount);

module.exports = router;