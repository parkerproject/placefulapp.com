const mongojs = require('mongojs');

const collections = ['placeful', 'guides'];

const db = mongojs(process.env.MONGODB_URL, collections);

module.exports = db;
