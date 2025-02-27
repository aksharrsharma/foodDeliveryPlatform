const User = require('../models/user');
const Item = require('../models/item');

exports.new = (req, res, next)=>{
    return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new User(req.body);
    user.save() // save document to database and check if successful
    .then(()=>{
        req.flash('success', 'Successfully created account!');
        req.session.save(()=>res.redirect('/users/login'));
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
            req.flash('error', err.message);
            return req.session.save(()=>res.redirect('back'));
        }

        // cannot create user with an already existing email 
        if(err.code === 11000){ //for duplicate key in email (should be unique)
            req.flash('error', 'Email address has been used');
            return req.session.save(()=>res.redirect('/users/new'));
        }
        next(err)
    });

};

exports.show = (req, res, next)=>{
    return res.render('./user/login');
};

exports.processLogin = (req, res, next)=>{

    //authenticate user's login request 
    let email = req.body.email;
    let password = req.body.password; 

    // get the user that matches the email 
    User.findOne({email: email})
    .then(user=>{
        if(user){
            //user is found in the database
            user.comparePassword(password) //returns t/f
            .then(result=>{
                if(result){
                    req.session.user = user._id; //store user's id in the session 
                    req.flash('success', 'You have successfully logged in');
                    return req.session.save(()=>res.redirect('back'));
                } else{
                    // console.log('wrong password');
                    req.flash('error', 'Wrong password');
                    req.session.save(()=>res.redirect('/users/login'));
                }
            })
        } else{
            // console.log('wrong email address');
            req.flash('error', 'Wrong email address');
            req.session.save(()=>res.redirect('/users/login'));
        }
    })
    .catch(err=>next(err));
};

// get profile 
exports.profile = (req, res, next)=>{
    
};

// logout the user 
exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};
