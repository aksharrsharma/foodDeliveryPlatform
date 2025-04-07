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
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const mongoUri = 'mongodb+srv://admin:admin@cluster0.k0jhn.mongodb.net/SilverSpoon?retryWrites=true&w=majority&appName=Cluster0';

app.set('view engine', 'ejs');

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err.message));

// session setup
app.use(session({
  secret: 'fjeudiufirnfrnifnreo',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 },
  store: MongoStore.create({ mongoUrl: mongoUri })
}));

app.use(flash());

// flash + user session setup
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

// admin checker
app.use((req, res, next) => {
  const userId = req.session.user;
  if (userId) {
    User.findById(userId)
      .then(user => {
        res.locals.isAdmin = user?.admin === 'silverSpoon';
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

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/items', itemRoutes);
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/orders', orderRoutes); 

// 404 handler
app.use((req, res, next) => {
  const err = new Error('The server cannot locate ' + req.url);
  err.status = 404;
  next(err);
});

// 500 error handler
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
