const express = require('express'); //initialize/utilize express.js
const controller = require('../controllers/itemsController');
const router = express.Router();
const {isLoggedIn, isAdmin, validateId} = require('../middlewares/auth');
const orderRoutes = require('./orderRoutes'); // reference the controllers file so we can use its methods


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
      
    const upload = multer({storage:storage}).single('image');


//GET /items: send all items to user 
router.get('/', controller.index);

//GET /items/new: send html form for creating a new item
router.get('/new', isLoggedIn, isAdmin, controller.new);

//POST /items: create a new item 
router.post('/', upload, isLoggedIn, isAdmin, controller.create);

//GET /items/:id: send details of an item identified by id
router.get('/:id', validateId, controller.show);

//GET /items/:id/edit: send html form for editing an existing item
router.get('/:id/edit', controller.edit);

//PUT /items/:id: update the item identified by id
router.put('/:id', upload, controller.update);

//DELETE /items/:id: send details of an item identified by id
router.delete('/:id', controller.delete);

router.use('/:id/orders', orderRoutes);


module.exports = router; 