const mongoose = require('mongoose');
const User = mongoose.model('User');
const Plan = mongoose.model('Plan');
const promisify = require('es6-promisify');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const cloudinary = require('cloudinary');
const Datauri = require('datauri');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_ACCOUNT,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

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
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }

  var dUri = new Datauri();
  dUri.format('.png', req.file.buffer);
  cloudinary.v2.uploader.upload(dUri.content, {transformation:
       {width: 500, height: 500, crop: "fill" }} )
  .then(function(image){
    req.body.photo = image.url
    next();
  })
  .catch(function(err){
    if (err){ console.log(err);}
    req.flash('error', err.message);
  });
};

exports.loginForm = (req, res) => {
  res.render('account/login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('account/register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
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
  console.log(req.body);
  const user = new User({ email: req.body.email });
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

  const userDonePlans = await Plan.find({
    _id: { $in: req.user.dones }
  });

  res.render('account/account', {userPlans, userHeartedPlans, userDonePlans,title: 'Your Account' });
};

exports.accountEdit = (req, res) => {
  res.render('account/accountEdit', { title: 'Edit Your Account' });
};

exports.accountAddProfileInfo = (req, res) => {
  res.render('account/addProfileInfo', { title: 'Complete your profile' });
};

exports.updateAccount = async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
    new: true, // return the new user instead of the old one
    runValidators: true,
    context: 'query'
  }).exec();
  req.flash('success', 'Updated the profile!');
  res.redirect('/account');
};
