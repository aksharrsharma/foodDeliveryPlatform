const express = require('express');
const controller = require('../controllers/orderController');
const { isGuest, isLoggedIn, isNotAdmin } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, isNotAdmin, controller.newOrder);

router.delete('/', isLoggedIn, isNotAdmin, controller.deleteOrder);

router.get('/view', isLoggedIn, controller.viewCart);

module.exports = router;
