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
  skillLevel: String,
  created: {
  type: Date,
  default: Date.now
  },
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
  slug: String,
  tags: [String]
});

planSchema.index({
  name: 'text',
  description: 'text'
});

planSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
  return next();
}
this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model('Plan', planSchema);
