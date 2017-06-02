const mongoose = require('mongoose');
const Plan = mongoose.model('Plan');

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
