/* eslint-disable strict */
'use strict';

const user = require('../users.js');

module.exports = (capability) =>{
  return (req,res,next) =>{
    try {
      if (user.capabilitiesChecker(capability, req.user.role)) {
        next();
      } else {
        next('Access Denied');
      }
    } catch (err) {
      next(err);
    }
  };
};