'use strict';

var Feed = require('./feed'),
  FeedParser = require('feedparser'),
  request = require('request'),
  Q = require('q');

var HackerNewsFeed = function(url) {
  this.url = url;
};

HackerNewsFeed.prototype = Object.create(Feed);

HackerNewsFeed.prototype._request = function() {
  return request(this.url);
};

HackerNewsFeed.prototype.parse = function(callback) {
  var index = 0,
    items = [],
    deferred = Q.defer();

  this._request()
    .pipe(new FeedParser())
    .on('error', function(error) {
      deferred.reject(error);
    })
    .on('readable', function() {
      var stream = this,
        item = null;

      while((item = stream.read())) {
        var link,
          author = item.author,
          points = 0;

        if(item['atom:points']) {
          points = item['atom:points']['#'];
        }

        if(item['atom:url']) {
          link = item['atom:url']['#'];
        }

        items.push({
          top: true,
          position: index + 1,
          title: item.title,
          link: link,
          author: author,
          authorLink: 'https://news.ycombinator.com/user?id=' + author,
          points: points,
          comments: parseInt(item.comments, 10),
          commentsLink: item.link,
          source: 'hacker_news'
        });

        index++;
      }
    })
    .on('end', function() {
      deferred.resolve(items);
    });

  return deferred.promise.nodeify(callback);
};

module.exports = HackerNewsFeed;