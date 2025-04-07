const {body} = require('express-validator');
const {validationResult} = require('express-validator'); //used to extract validation errors 


exports.validateSignup = [
body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateLogin = [
body('email', 'Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateResult = (req, res, next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else{
        return next();
    }
}

exports.validateItem = [
body('title', 'A title is required.').isLength({min:1}).trim().escape(),
body('price', 'Price must be at least $0.01 and under $1m').isFloat({min: 0.01, max: 1000000}),
body('description', 'Description must be at least 10 characters').isLength({min:10}).trim().escape(),
];

