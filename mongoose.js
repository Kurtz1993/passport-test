const mongoose = require('mongoose');
const url = require('url');

const UserModel = require('./models/user.model');


const dbUrl = url.format({
    protocol: 'mongodb',
    slashes: true,
    hostname: 'localhost',
    port: '27017',
    pathname: 'passport-test'
});

module.exports = function () {
    mongoose.Promise = global.Promise;

    const db = mongoose.connect(dbUrl);

    return db;
};