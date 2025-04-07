const express = require('express');
const controller = require('../controllers/profileController');
const {isGuest, isLoggedIn, isNotAdmin} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignup, validateLogin, validateResult} = require('../middlewares/validator');
const router = express.Router();

// get all orders associated with the user
router.get('/mycart', isLoggedIn, isNotAdmin, controller.displayUserCart);

// new order 
// router.post('/', isLoggedIn, isNotAdmin, controller.new);

module.exports = router; 
