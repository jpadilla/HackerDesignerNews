var posts = require('../app/controllers/posts');

module.exports = function(app) {
  app.get('/top/:source?', posts.index);
};