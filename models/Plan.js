const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs')

const planSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title for your awesome plan!'
  },
  tagline: {
    type: String,
    trim: true,
    required: 'Please enter a tagline for your awesome plan!'
  },
  description: {
    type: String,
    trim: true
  },
  activities: [String],
  skillLevel: String,
  mintime: String,
  packlist: String,
  parking: String,
  recommendations: String,
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
photos: [String],
author: {
  type: mongoose.Schema.ObjectId,
  ref: 'User',
  required: 'You must supply an author'
}
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
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
});

// find reviews where the plans _id property === reviews plan property
planSchema.virtual('reviews', {
  ref: 'Review', // what model to link?
  localField: '_id', // which field on the plan?
  foreignField: 'plan' // which field on the review?
});

planSchema.virtual('averageRating').get(function() {
  const ratingArray = [];
  this.reviews.forEach(function(review) {
    ratingArray.push(review.rating);
  });
  var total = 0;
  for(var i = 0; i < ratingArray.length; i++) {
      total += ratingArray[i];
  }
  var avgRating = total / ratingArray.length;
  return avgRating.toFixed(1)
});

function autopopulate(next) {
  this.populate('reviews');
  next();
}

planSchema.pre('find', autopopulate);
planSchema.pre('findOne', autopopulate);


module.exports = mongoose.model('Plan', planSchema);
