const express = require('express');
const controller = require('../controllers/profileController');
const {isGuest, isLoggedIn, isNotAdmin, isAdmin} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignup, validateLogin, validateResult} = require('../middlewares/validator');
const router = express.Router();

// get all orders associated with the user
router.get('/mycart', isLoggedIn, isNotAdmin, controller.displayUserCart);

router.post('/mycart', isLoggedIn, isNotAdmin, controller.checkout);

router.get('/receipt', isLoggedIn, isNotAdmin, controller.receipts);

router.get('/transactions', isLoggedIn, isAdmin, controller.transactions);

router.get('/dashboard', isLoggedIn, isAdmin, controller.dashboard);





// new order 
// router.post('/', isLoggedIn, isNotAdmin, controller.new);

module.exports = router; 
