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
