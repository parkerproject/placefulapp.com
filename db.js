const mongojs = require('mongojs');

const collections = ['placeful'];

const db = mongojs(process.env.MONGODB_URL, collections);

module.exports = db;
