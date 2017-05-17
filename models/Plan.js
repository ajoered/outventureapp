const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs')

const planSchema = new mongoose.Schema({
  title: {
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

module.exports = mongoose.model('Plan', planSchema);
