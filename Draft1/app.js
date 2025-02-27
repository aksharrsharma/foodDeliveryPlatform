//require modules 
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const itemRoutes = require('./routes/itemRoutes'); //put and delete 
const userRoutes = require('./routes/userRoutes');

const app = express();
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');
const mongoUri = 'mongodb+srv://admin:admin@cluster0.k0jhn.mongodb.net/SilverSpoon?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongoUri)
.then(()=>{
    //start app
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));


// middleware functions 
app.use(session({
    secret: 'fjeudiufirnfrnifnreo',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000}, //cookie good for 1hr 
    store: new MongoStore({mongoUrl: mongoUri})
}));

app.use(flash()); // flash is stored in the session (important to create session then flash)

app.use((req, res, next)=>{
    // console.log(req.session);
    res.locals.user = req.session.user||null; // store the user in res.locals so we can access it in views
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extend: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));


app.get('/', (req, res)=>{
    res.render('index');
});

app.use('/items', itemRoutes); // upon /items, reference itemRoutes 
app.use('/users', userRoutes);


// 404 error handler (cannot GET page)
app.use((req, res, next) =>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err); //
});

// internal 500 error handling 
app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status){ // if the error has no status, set it to 500 (internal server error)
        err.status = 500; 
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error',{error: err});
});