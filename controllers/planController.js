exports.landingPage = (req, res) => {
  res.render('landing', { title: "OUTVENTURE" })
}

exports.addPlan = (req, res) => {
  res.render('editPlan', { title: 'Add Plan' });
};
