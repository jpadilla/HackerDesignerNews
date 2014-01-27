'use strict';

var mongoose = require('mongoose'),
  generateResponse = require('../helpers/posts').generateResponse,
  Post = mongoose.model('Post');

exports.index  = function(req, res) {
  var format = req.params.format || 'json',
    conditions = {top: true};

  if(req.params.source === 'hn') {
    conditions.source = 'hacker_news';
  } else if(req.params.source === 'dn') {
    conditions.source = 'designer_news';
  }

  Post.find(conditions, {_id: 0, __v: 0, top: 0})
    .sort({source: 'asc', position: 'asc'})
    .lean()
    .exec(function(err, posts) {
      if(err) return res.render('500');
      return generateResponse(res, format, posts);
    });
};