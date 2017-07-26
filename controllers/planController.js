const mongoose = require('mongoose');
const Plan = mongoose.model('Plan');
const User = mongoose.model('User');
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

exports.upload = multer(multerOptions).array('photos', 10);

exports.resize = async (req, res, next) => {
  // console.log(req.files);
  // console.log(req.body);
  const files = req.files
  // check if there is no new file to resize
  if (!req.files) {
    next(); // skip to the next middleware
    return;
  }
  if (!req.body.photos) {
    req.body.photos = [];
  }

  files.forEach(function(file) {
    const extension = file.mimetype.split('/')[1];
    const photoId = `${uuid.v4()}.${extension}`
    req.body.photos.push(photoId);
    // now we resize
    jimp.read(file.buffer, function (err, photo) {
      console.log(photo);
      if (err) throw err;
      photo.resize(800, jimp.AUTO).write(`./public/uploads/${photoId}`);
    });
  });
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.explore = async (req, res) => {
  const plans = await Plan.find();
  console.log(plans);
  res.render('explore', { title: "OUTVENTURE | Explore", plans })
}

exports.addPlan = (req, res) => {
  res.render('editPlan', { title: 'Add a plan idea' });
};

exports.createPlan = async (req, res) => {
  req.body.author = req.user._id;
  const plan = new Plan(req.body)
  console.log(req.body);
  await plan.save()
  User.findByIdAndUpdate(req.user._id,
      { $addToSet: { plans: req.params.id } },
      { new: true }
    );
  req.flash('success', `Successfully Created ${plan.title}!`);
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

const confirmOwner = (plan, user) => {
  if (!plan.author.equals(user._id)) {
    throw Error('You must own a plan in order to edit it!');
  }
};

exports.editPlan = async (req, res) => {
  // 1. Find the store given the ID
  const plan = await Plan.findOne({ _id: req.params.id });
  // 2. confirm they are the owner of the plan
  confirmOwner(plan, req.user)
  // 3. Render out the edit form so the user can update their plan
  res.render('editPlan', { title: `Edit ${plan.title}`, plan });
};

exports.getPlanBySlug = async (req, res) => {
  const plan = await Plan.findOne({ slug: req.params.slug }).populate('author reviews');
  if (!plan) return next();
  res.render('plan', { plan, title: plan.title });
}

exports.mapPlans = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const activities = ((req.query.activities !== undefined) ? { $in: req.query.activities.split(",") } : { $exists: true });
  const skillLevel = ((req.query.skillLevel !== undefined) ? { $in: req.query.skillLevel.split(",") } : { $exists: true });
  const tags = ((req.query.tags !== undefined) ? { $in: req.query.tags.split(",") } : { $exists: true });
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
      skillLevel: skillLevel,
      tags: tags
    };
  const plans = await Plan.find(q).populate(' author reviews ').limit(100);
  res.json(plans);
};


exports.heartPlan = async (req, res) => {
  if (req.user == undefined) {
    return res.status(500).send({ error: 'You must login' })
  } else {

    // const plan = await Plan
    //   .findById(req.params.id);
    //
    // const userHearts = plan.userHearts.map(obj => obj.toString());
    // //if not included add, else remove
    // const planOperator = userHearts.includes(req.user._id) ? '$pull' : '$addToSet';
    // const newPlan = await Plan
    //   .findByIdAndUpdate(req.params.id,
    //     { [planOperator]: { userHearts: req.user._id } },
    //     { new: true }
    //   );

    const hearts = req.user.hearts.map(obj => obj.toString());
    //if not included add, else remove
    const userOperator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User
      .findByIdAndUpdate(req.user._id,
        { [userOperator]: { hearts: req.params.id } },
        { new: true }
      );
    res.json(user);
  }
};

exports.donePlan = async (req, res) => {
  if (req.user == undefined) {
    return res.status(500).send({ error: 'You must login' })
  } else {
    const dones = req.user.dones.map(obj => obj.toString());
    //if not included add, else remove
    const operator = dones.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User
      .findByIdAndUpdate(req.user._id,
        { [operator]: { dones: req.params.id } },
        { new: true }
      );
    res.json(user);
    }
};
