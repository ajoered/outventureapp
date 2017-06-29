const mongoose = require('mongoose');
const User = mongoose.model('User');
const Plan = mongoose.model('Plan');
const promisify = require('es6-promisify');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed! Please only upload jpg/png/gif' }, false);
    }
  }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  console.log(req.file);
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

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
    gmail_remove_dots: false,
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
    console.log(err);
      if (err) {
      req.flash('error', err.message);
      res.render('account/register', {
        title: 'Register',
        body: req.body,
        flashes: req.flash() });
      } else {
        next();
      }
  });
  next();
};

exports.account = async (req, res) => {
  const userPlans = await Plan.find({
    author: { $in: req.user._id }
  });

  const userHeartedPlans = await Plan.find({
    _id: { $in: req.user.hearts }
  });

  res.render('account/account', {userPlans, userHeartedPlans, title: 'Your Account' });
};

exports.accountEdit = (req, res) => {
  res.render('account/accountEdit', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
    new: true, // return the new user instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', 'Updated the profile!');
  res.redirect('/account');
};
