'use strict';

var Feed = require('./feed'),
  request = require('request'),
  cheerio = require('cheerio'),
  Q = require('q');

var DesignerNewsFeed = function(url) {
  this.url = url;
};

DesignerNewsFeed.prototype = Object.create(Feed);

DesignerNewsFeed.prototype._request = function(callback) {
  return request(this.url, callback);
};

DesignerNewsFeed.prototype.parse = function(callback) {
  var deferred = Q.defer(),
    _this = this;

  this._request(function(err, resp, body) {
    if(err) deferred.reject(err);

    var $ = cheerio.load(body),
      $stories = $('.Story'),
      items = [];

    $stories.each(function(index) {
      var $storyUrl = $(this).find('.StoryUrl');

      $storyUrl.find('.Domain').remove();

      var $below = $(this).find('.Below'),
        $pointCount = $below.find('.PointCount'),
        $commentCount = $below.find('.CommentCount'),
        $submitter = $(this).find('.Submitter');

      var link = $storyUrl.attr('href'),
        title = $storyUrl.text().trim(),
        points = $pointCount.text().split(' point')[0],
        comments = $commentCount.text().split(' comment')[0],
        commentsLink = $commentCount.attr('href'),
        submitterLink = $submitter.attr('href'),
        submitterName = $submitter.text().trim();

      if(link.indexOf('/stories/') === 0) {
        link = _this.url + link;
      }

      items.push({
        top: true,
        position: index + 1,
        title: title,
        link: link,
        author: submitterName,
        authorLink: _this.url + submitterLink,
        points: parseInt(points, 10),
        comments: parseInt(comments, 10),
        commentsLink: _this.url + commentsLink,
        source: 'designer_news'
      });

    });

    deferred.resolve(items);
  });

  return deferred.promise.nodeify(callback);
};

module.exports = DesignerNewsFeed;