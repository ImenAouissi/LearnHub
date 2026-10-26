const mongoose = require('mongoose');
const { mongoUrl } = require('../config');

async function connectMongo() {
  await mongoose.connect(mongoUrl);
  console.log('MongoDB connecte');
}

module.exports = { connectMongo };
