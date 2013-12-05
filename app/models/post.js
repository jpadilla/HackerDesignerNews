var mongoose = require('mongoose');
var audit = require('../../lib/mongoose-audit');
var Schema = mongoose.Schema;

module.exports = function() {
  var postSchema = new Schema({
    title: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    authorLink: {
      type: String,
      trim: true
    },
    position: Number,
    top: Boolean,
    points: Number,
    comments: Number,
    commentsLink: {
      type: String,
      trim: true
    },
    source: String
  });

  postSchema.plugin(audit);

  postSchema.statics.createOrUpdate = function(postData, cb) {
    var Post = this;
    var conditions = {
      link: postData.link,
      source: postData.source
    };

    Post.findOne(conditions, function(err, post) {
      if(err) cb(err);

      if(post) {
        // Update post
        for(var key in postData) {
          var val = postData[key];
          post[key] = val;
        }
      } else {
        // Create post
        post = new Post(postData);
      }

      post.save(function(err, post) {
        if(err) cb(err);
        cb(null, post);
      });

    });
  };

  mongoose.model('Post', postSchema);

};