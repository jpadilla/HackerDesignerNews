'use strict';

// Start Profiler
require('./lib/profile');

// Module dependencies.
var express = require('express');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var config = require('./config/config'),
  mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);

// Require models
var modelsPath = __dirname + '/app/models';
require('./lib/models-loader')(modelsPath);

var app = express();

// express settings
require('./config/express')(app, config);

// Bootstrap routes
require('./config/routes')(app);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port '+port);

// expose app
exports = module.exports = app;