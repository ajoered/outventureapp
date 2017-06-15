const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs')

const planSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title for your awesome plan!'
  },
  description: {
    type: String,
    trim: true
  },
  activities: [String],
  skillLevel: [String],
  created: {
    type: Date,
    default: Date.now
  },
  slug: String,
  tags: [String],
  location: {
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: [{
    type: Number,
    required: 'You must supply coordinates!'
  }],
  address: {
    type: String,
    required: 'You must supply an address!'
  }
},
photo: String,
author: {
  type: mongoose.Schema.ObjectId,
  ref: 'User',
  required: 'You must supply an author'
}
});

planSchema.index({
  title: 'text',
  description: 'text'
});

planSchema.index({ location: '2dsphere' });

planSchema.pre('save', async function(next) {
  if (!this.isModified('title')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.title);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const plansWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (plansWithSlug.length) {
    this.slug = `${this.slug}-${plansWithSlug.length + 1}`;
  }
  next();
  // TODO make more resiliant so slugs are unique
});

module.exports = mongoose.model('Plan', planSchema);
