const Item = require('../models/item');
const User = require('../models/user');


// check if the user is a guest 
exports.isGuest = (req, res, next)=>{
    if(!req.session.user) //if not logged in, continue 
        return next();
    else{
        req.flash('error', 'You are logged in already');
        return req.session.save(()=>res.redirect('back'));
    }
}

// check if user is authenticated 
exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user) //if logged in, continue 
        return next();
    else{
        req.flash('error', 'You need to log in first');
        return req.session.save(()=>res.redirect('/users/login'));
    }
}


exports.validateId = (req, res, next) =>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        req.flash('error', err.message, '- Error status: ', err.status);
        return req.session.save(()=>res.redirect('back'));
    }else{
        next();
    }
}

exports.isAdmin = (req, res, next) =>{
    const userId = req.session.user;  // Assuming you're storing the user ID in the session
        // console.log(userId);
        if (userId) {
            User.findById(userId)
                .then(user => {
                    if (user) {
                        // Check if the user is an admin
                        if (user.admin != 'silverSpoon') {
                            req.flash('error', 'Unauthorized permissions to view resource');
                            req.session.save(()=>res.redirect('back'));
                        } else {
                            next();
                        }
                    }
                })

                .catch(err=>next(err));
        }
};

exports.isNotAdmin = (req, res, next) =>{
    if(req.session.user){

    
    const userId = req.session.user;  // Assuming you're storing the user ID in the session
        console.log(userId);
        if (userId) {
            User.findById(userId)
                .then(user => {
                    if (user) {
                        // Check if the user is an admin
                        if (user.admin == 'silverSpoon') {
                            req.flash('error', 'Unauthorized permissions to view resource');
                            req.session.save(()=>res.redirect('back'));
                        } else {
                            next();
                        }
                    }
                })

                .catch(err=>next(err));
        }
    }
};
    
