const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = 'secret eventually into env config file';

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: val => `${val.value} is not a valid email.`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, secretKey).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token
    });
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    // decoded will store the decoded jwt values.
    let decoded;

    try {
        decoded = jwt.verify(token, secretKey);
    } catch (e) {
        return Promise.reject();
        /*
        Is the same as:
        return new Promise((resolve, reject) => {
            reject();
        });
        */
    }

    return User.findOne({
       '_id': decoded._id,
       'tokens.token': token,
       'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = {User, secretKey};