const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const bcrypt = require('bcrypt');

const userSchema = new Schema ({
    firstName: {type: String, required: [true, 'cannot be empty']},
    lastName: {type: String, required: [true, 'cannot be empty']},
    email: {type: String, required: [true, 'cannot be empty'], unique: true},
    password: {type: String, required: [true, 'cannot be empty']},
    favorites: [{dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }}],
    admin: {type: String, default:"notAdmin"}
});

// replace plaintext password with hashed password before saving the document in the database 
// pre middleware 

userSchema.pre('save', function(next){
    let user = this; 
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

// implement a method to compare the login password an the hash stored in the database
userSchema.methods.comparePassword = function(loginPassword){
    return bcrypt.compare(loginPassword, this.password);
}


module.exports = mongoose.model('User', userSchema);
