/* eslint-disable strict */
'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const users = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

users.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 5);
    }
    return Promise.reject();
});

users.statics.authenticater = function (auth) { /// I got confused to use eathier statcs or methods for this function  
    let query = { username: auth.user };
    return this.findOne(query)
        .then(user => {
            return user.passwordComparator(auth.pass);
        })
        .catch(console.error);
};

users.methods.passwordComparator = function (pass) {
    console.log('password1', pass);
    console.log('password2', this.password);
    return bcrypt.compare(pass, this.password)
        .then(valid => {
            return valid ? this : null
        });
};

users.statics.tokenGenerator = function (user) {
    console.log('there');
    let token = {
        id: user._id,
    };
    return jwt.sign(token, SECRET);
};

users.statics.list = async function () {
    let result = await this.find({});
    return result;
}

module.exports = mongoose.model('users', users);