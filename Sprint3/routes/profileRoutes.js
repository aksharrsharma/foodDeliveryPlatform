const express = require('express');
const controller = require('../controllers/profileController');
const {isGuest, isLoggedIn, isNotAdmin, isAdmin} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignup, validateLogin, validateResult} = require('../middlewares/validator');
const router = express.Router();

// get all orders associated with the user
router.get('/mycart', isLoggedIn, isNotAdmin, controller.displayUserCart);

// get cart count for AJAX requests
router.get('/mycart/count', isLoggedIn, controller.getCartCount);

router.post('/mycart', isLoggedIn, isNotAdmin, controller.checkout);

router.get('/receipt', isLoggedIn, controller.receipts);

router.get('/transactions', isLoggedIn, isAdmin, controller.transactions);

router.get('/dashboard', isLoggedIn, isAdmin, controller.dashboard);

router.get('/favorites', isLoggedIn, isNotAdmin, controller.getFavorites);

module.exports = router;