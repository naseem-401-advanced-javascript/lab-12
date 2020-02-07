/* eslint-disable no-undef */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */
'use strict';

const express = require('express');
const router = express.Router();

const User = require('./users.js');
const authMiddleware = require('./auth-middleware.js');

router.post('/signup', signup);
router.post('/signin', authMiddleware, signin);

function signup(req, res, next) {
  let user = new User(req.body);
  user.save()
    .then(user => {
      req.token = user.tokenGenerator();
      req.user = user;
      res.status(200).send(req.token);
    })
    .catch(next);
}

function signin(req, res, next) {
  res.send(req.token);
}

module.exports = router;