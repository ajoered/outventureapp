const mongoose = require('mongoose');
const User = mongoose.model('User');
const Plan = mongoose.model('Plan');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('account/login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('account/register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('account/register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password, (err) => {
      req.flash('error', err.message);
      res.render('account/register', {
        title: 'Register',
        body: req.body,
        flashes: req.flash() });
  });
};

exports.account = async (req, res) => {
  const userPlans = await Plan.find({
    author: { $in: req.user._id }
  });

  const userHeartedPlans = await Plan.find({
    _id: { $in: req.user.hearts }
  });

  console.log(userHeartedPlans);
  res.render('account/account', {userPlans, userHeartedPlans, title: 'Your Account' });
};

exports.accountEdit = (req, res) => {
  res.render('account/accountEdit', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated the profile!');
  res.redirect('/account');
};
