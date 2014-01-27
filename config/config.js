'use strict';

var path = require('path');

var env = process.env.NODE_ENV || 'development',
  rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    secret: 'abc123',
    db: 'mongodb://localhost/HackerDesignerNews',
    root: rootPath
  },
  production: {
    secret: process.env.SECRET_KEY,
    db: process.env.MONGOHQ_URL,
    root: rootPath
  }
}[env];