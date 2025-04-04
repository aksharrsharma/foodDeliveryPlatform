const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  admin: {
    type: String,
    enum: ['silverSpoon', 'notAdmin'],
    default: 'notAdmin'
  }
});

userSchema.pre('save', async function (next) {
  console.log('📦 Saving user:', this); 
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      console.log('🔐 Password hashed successfully:', this.password); 
    } catch (err) {
      console.log('❌ Password hashing error:', err.message);
      return next(err);
    }
  }

  next();
});

userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
