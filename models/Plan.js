const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs')

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a name for your awesome plan!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String]
});

planSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
  return next();
}
this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model('Plan', planSchema);
