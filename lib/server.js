/* eslint-disable no-undef */
/* eslint-disable strict */
'use strict';

// 3rd party dependencies
const express = require('express');
const morgan = require('morgan');

// custom middleware
const notFoundHandler = require('../middleware/404.js');
const errorHandler = require('../middleware/500.js');

// app constant
const app = express();

app.use(express.json);
app.use(morgan('dev'));
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`${PORT} working`));
  },
};