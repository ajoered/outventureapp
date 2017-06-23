require('dotenv').config({ path: __dirname + '/../variables.env' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
var faker = require('faker');

// import all of our models - they need to be imported only once
// const Plans = require('../models/Plans');
// const Review = require('../models/Review');
const User = require('../models/User');

const users = [{
  name: faker.name.findName(),
  email: faker.internet.email(),
  bio: faker.lorem.sentence()
}, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  bio: faker.lorem.sentence()
}];


async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  // await Plans.remove();
  // await Review.remove();
  await User.remove();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
  process.exit();
}

async function loadData() {
  try {
    // await Plans.insertMany(plans);
    // await Review.insertMany(reviews);
    await User.insertMany(users);
    console.log('👍👍👍👍👍👍👍👍 Done!');
    process.exit();
  } catch(e) {
    console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
