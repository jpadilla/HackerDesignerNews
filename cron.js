// Start Profiler
require('./lib/profile');

// Module dependencies.
var request = require('request'),
  cheerio = require('cheerio'),
  mongoose = require('mongoose'),
  async = require('async'),
  config = require('./config/config');

// Connect to MongoDB
mongoose.connect(config.db);

// Require models
var models_path = __dirname + '/app/models';
require('./lib/models-loader')(models_path);

var Post = mongoose.model('Post');

var resetTopPosts = function(cb) {
  var conditions = {top: true},
    update = {top: false},
    options = {multi: true};

  Post.update(conditions, update, options, function(err) {
    if(err) cb(err);
    console.log('[FINISH] resetTopPosts');
    cb(null);
  });
};

var createOrUpdatePosts = function(data, cb) {
  var posts = [],
    i = 0;

  async.whilst(
      function() { return i < data.length; },
      function(callback) {
        Post.createOrUpdate(data[i], function(err, post) {
          posts.push(post);
          callback();
        });
        i++;
      },
      function(err) {
          if(err) cb(err);
          console.log('[FINISH] createOrUpdatePosts');
          cb(null, posts);
      }
  );
};

var run = function(callback) {
  console.log('[START] running cron');

  var Q = require('q'),
    HackerNewsFeed  = require('./feeds/hacker_news'),
    DesignerNewsFeed = require('./feeds/designer_news');

  var HNFeed = new HackerNewsFeed('http://hnsearch.com/rss'),
    DNFeed = new DesignerNewsFeed('https://news.layervault.com');

  var queue = [
    HNFeed.parse(),
    DNFeed.parse()
  ];

  Q.all(queue).then(function(response) {
    var HNItems = response[0],
      DNItems = response[1],
      posts = HNItems.concat(DNItems);

      resetTopPosts(function(err) {
        if(err) callback(err);

        createOrUpdatePosts(posts, function(err, posts) {
          if(err) callback(err);
          callback();
        });
      });

  }, function(rej) {
    callback(rej);
  }).fail(function(err) {
    callback(err);
  });
};

run(function(err) {
  if(err) console.log('[ERROR]', err);
  console.log('[FINISH] running cron');
  process.exit();
});