var fs = require('fs');


module.exports = function(models_path) {
  // Bootstrap models
  fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)();
  });
};
