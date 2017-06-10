const mongoose = require('mongoose');
const Plan = mongoose.model('Plan');
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

exports.explore = async (req, res) => {
  const plans = await Plan.find();
  console.log(plans);
  res.render('explore', { title: "OUTVENTURE | Explore", plans })
}

exports.addPlan = (req, res) => {
  res.render('editPlan', { title: 'Add Plan' });
};

exports.createPlan = async (req, res) => {
  console.log(req.body);
  const plan = new Plan(req.body)
  await plan.save()
  req.flash('success', `Successfully Created ${plan.title}. Care to leave a review?`);
  res.redirect("/")
};

exports.updatePlan = async (req, res) => {
  req.body.location.type = 'Point';
  const plan = await Plan.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new plan instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${plan.name}</strong>. <a href="/plans/${plan.slug}">View Store →</a>`);
  res.redirect(`/plans/${plan._id}/edit`);
  // Redriect them the store and tell them it worked
};

exports.editPlan = async (req, res) => {
  // 1. Find the store given the ID
  const plan = await Plan.findOne({ _id: req.params.id });
  // 2. confirm they are the owner of the plan
  // 3. Render out the edit form so the user can update their plan
  res.render('editPlan', { title: `Edit ${plan.title}`, plan });
};

exports.mapPlans = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const activities = ((req.query.activities !== undefined) ? { $in: req.query.activities.split(",") } : { $exists: true });
  const skillLevel = ((req.query.skillLevel !== undefined) ? { $in: req.query.skillLevel.split(",") } : { $exists: true });
    const q = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: 100000 // 100km
        }
      },
      activities: activities,
      skillLevel: skillLevel
    };
  const plans = await Plan.find(q).limit(10);
  res.json(plans);
};
