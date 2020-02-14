/* eslint-disable strict */
'use strict';

const user = require('../users.js');

module.exports = () =>{
  return (req,res,next) =>{
    try {
      if (user.capabilitiesChecer(capability, req.user.capabilities)) {
        next();
      } else {
        next('Access Denied');
      }
    } catch (err) {
      next(err);
    }
  };
};