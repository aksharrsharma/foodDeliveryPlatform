const express = require('express');
const controller = require('../controllers/itemsController');
const router = express.Router();
const { isLoggedIn, isAdmin, validateId } = require('../middlewares/auth');
const orderRoutes = require('./orderRoutes');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('image');

router.get('/', controller.index);
router.get('/new', isLoggedIn, isAdmin, controller.new);
router.post('/', upload, isLoggedIn, isAdmin, controller.create);
router.get('/:id', validateId, controller.show);
router.get('/:id/edit', isLoggedIn, isAdmin, validateId, controller.edit);


router.patch('/:id', upload, isLoggedIn, isAdmin, validateId, controller.update);
router.delete('/:id', isLoggedIn, isAdmin, validateId, controller.delete);

router.use('/:id/orders', orderRoutes);

module.exports = router;
