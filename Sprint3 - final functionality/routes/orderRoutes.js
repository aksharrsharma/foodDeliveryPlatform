const express = require('express');
const controller = require('../controllers/orderController');
const {isGuest, isLoggedIn, isNotAdmin} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignup, validateLogin, validateResult} = require('../middlewares/validator');

const router = express.Router({mergeParams: true}); // make the router

// get all orders associated with the user
// router.get('/', isLoggedIn, isNotAdmin, controller.index);

// new order 
router.post('/', isLoggedIn, isNotAdmin, controller.new);

router.delete('/', isLoggedIn, isNotAdmin, controller.delete);

module.exports = router; 
