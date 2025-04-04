// Load environment variables dynamically based on mode
if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
  } else {
    require('dotenv').config();
  }
  
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  console.log('🔥 NODE_ENV:', process.env.NODE_ENV);
  
  const express = require('express');
  const morgan = require('morgan');
  const methodOverride = require('method-override');
  const session = require('express-session');
  const MongoStore = require('connect-mongo');
  const mongoose = require('mongoose');
  const flash = require('connect-flash');
  const User = require('./models/user');
  const Item = require('./models/item');
  const itemRoutes = require('./routes/itemRoutes');
  const userRoutes = require('./routes/userRoutes');
  
  const app = express();
  app.set('view engine', 'ejs');
  
  // Session setup
  app.use(session({
    secret: 'fjeudiufirnfrnifnreo',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: new MongoStore({
      mongoUrl: process.env.TEST_DB_URI || process.env.MONGO_URI
    })
  }));
  
  // Flash messages
  app.use(flash());
  
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
  });
  
  app.use((req, res, next) => {
    const userId = req.session.user;
    if (userId) {
      User.findById(userId)
        .then(user => {
          res.locals.isAdmin = user && user.admin === 'silverSpoon';
          next();
        })
        .catch(err => {
          console.error(err);
          res.locals.isAdmin = false;
          next();
        });
    } else {
      res.locals.isAdmin = false;
      next();
    }
  });
  
  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('tiny'));
  app.use(methodOverride('_method'));
  
  // Routes
  app.get('/', (req, res) => {
    res.render('index');
  });
  
  app.use('/items', itemRoutes);
  app.use('/users', userRoutes);
  
  // 404 handler
  app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
  });
  
  // General error handler
  app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
      err.status = 500;
      err.message = 'Internal Server Error';
    }
    res.status(err.status);
    res.render('error', { error: err });
  });
  
  module.exports = app;
  