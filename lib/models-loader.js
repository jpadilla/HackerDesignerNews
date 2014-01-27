'use strict';

var fs = require('fs');


module.exports = function(modelsPath) {
  // Bootstrap models
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelsPath + '/' + file)();
  });
};
