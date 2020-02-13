/* eslint-disable no-unused-vars */
/* eslint-disable strict */
'use strict';

const base64 = require('base-64');
const users = require('./users.js');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('invalid login');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');
  let auth = { user, pass };

  users.authenticater(auth)
    .then(validUser => {
      console.log(validUser);
      req.token = users.signinTokenGenerator(validUser);
      next();
    })
    .catch(() => next('invalid login'));
};