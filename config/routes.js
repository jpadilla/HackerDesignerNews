var posts = require('../app/controllers/posts');

module.exports = function(app) {
  app.get('/top.:format?', posts.index);
  app.get('/top/:source.:format?', posts.index);
};