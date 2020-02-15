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
  role: { type: String, required: true, default: 'client', enum: ['client', 'user', 'admin'] },
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 5);
  }
  return Promise.reject();
});

// statics with schema iself
// methods with instantiate
users.statics.authenticater = function (auth) {
  let query = { username: auth.user };

  return this.findOne(query)
    .then(user => {
      return user.passwordComparator(auth.pass);
    })
    .catch(console.error);
};
// beacuse it is for one username
users.methods.passwordComparator = function (pass) {
  return bcrypt.compare(pass, this.password)
    .then(valid => {
      return valid ? this : null;
    });
};

users.methods.signupTokenGenerator = function (user) {
  let token = {
    id: user._id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(token, SECRET);
};

users.statics.signinTokenGenerator = function (user) {
  let token = {
    id: user._id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(token, SECRET);
};

users.statics.list = async function () {
  let result = await this.find({});
  return result;
};

users.statics.authenticateToken = async function (token) {
  try {
    let tokenObject = jwt.verify(token, SECRET);
    if (tokenObject) {
      return Promise.resolve(tokenObject);
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject();
  }
};

users.statics.capabilitiesChecker = (ability, role) => {
  let admin = ['read', 'create', 'update', 'delete'];
  let user = ['read', 'create', 'update'];
  let client = ['read'];
  console.log('nsns',role);
  if (role === 'admin') {
    for (let i = 0; i < admin.length; i++) {
      if (admin[i]) {
        return true;
      }
    }
  }
  if (role === 'user') {
    for (let i = 0; i < user.length; i++) {
      if (user[i]) {
        return true;
      }
    }
  }
  if (role === 'client') {
    for (let i = 0; i < client.length; i++) {
      if (client[i]) {
        return true;
      }
    }
  }
};

module.exports = mongoose.model('users', users);