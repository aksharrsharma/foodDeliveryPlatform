const User = require('../models/user');
const Item = require('../models/item');

exports.new = (req, res, next) => {
  return res.render('./user/new');
};

exports.create = async (req, res, next) => {
  const user = new User(req.body);

  if (!user.admin) {
    user.admin = 'notAdmin';
  }

  if (user.admin !== 'silverSpoon' && user.admin !== 'notAdmin') {
    if (process.env.NODE_ENV === 'test') {
      return res.status(400).json({ error: 'Unauthorized admin registration' });
    }
    req.flash('error', 'Unauthorized admin registration');
    return res.redirect('back');
  }

  try {
    await user.save();
    req.session.user = user._id;

    if (process.env.NODE_ENV === 'test') {
      return res.status(201).json({ message: 'User created' });
    }

    req.flash('success', `Successfully created ${user.firstName}'s account!`);
    return res.redirect('/items');
  } catch (err) {
    console.error('❌ User save failed:', err.message);
    if (process.env.NODE_ENV === 'test') {
      return res.status(400).json({ error: err.message });
    }
    req.flash('error', err.message);
    return res.redirect('back');
  }
};

exports.show = (req, res, next) => {
  return res.render('./user/login');
};

exports.processLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      if (process.env.NODE_ENV === 'test') {
        return res.status(401).json({ error: 'Email not found' });
      }
      req.flash('error', 'Email not found');
      return res.redirect('/users/login');
    }

    const match = await user.comparePassword(password);
    if (!match) {
      if (process.env.NODE_ENV === 'test') {
        return res.status(401).json({ error: 'Incorrect password' });
      }
      req.flash('error', 'Incorrect password');
      return res.redirect('/users/login');
    }

    req.session.user = user._id;
    if (process.env.NODE_ENV === 'test') {
      return res.status(200).json({ message: 'Login successful' });
    }

    req.flash('success', `Logged in as ${user.firstName}`);
    return res.redirect('/items');

  } catch (err) {
    next(err);
  }
};

exports.profile = (req, res, next) => {
  // Placeholder for user profile view
};

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err);
    res.redirect('/');
  });
};
