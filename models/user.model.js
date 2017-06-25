const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: [true, 'Username is required.'],
        lowercase: true
    },
    password: {
        type: String
    },
    salt: {
        type: String
    }
});

UserSchema.methods.hashPassword = function (password) {
    return crypto
        .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
        .toString('base64');
};

UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

UserSchema
    .pre('save', function (next) {
        if (!this.password) {
            return next(new Error('Password is required.'));
        } else {
            this.salt = new Buffer(crypto
                .randomBytes(16)
                .toString('base64'), 'base64');
            this.password = this.hashPassword(this.password);
        }


        next();
    });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;