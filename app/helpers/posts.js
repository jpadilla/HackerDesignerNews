exports.generateResponse = function(res, format, posts) {
  var js2xmlparser = require("js2xmlparser"),
    Feed = require('feed'),
    data;

  if(format == 'xml') {
    parserOptions = {prettyPrinting: {indentString: ' '}};
    xml = js2xmlparser('posts', {'post': posts}, parserOptions);

    res.set('Content-Type', 'text/xml');

    data = res.send(xml);
  } else if(format == 'rss' || format == 'atom') {
    var feed = new Feed({
      title: 'The Hacker and Designer News',
      description: 'Hacker News and Designer News current top posts',
      link: 'http://hdn.io',
      author: {
          name: 'Jose Padilla',
          email: 'hello@jpadilla.com',
          link: 'http://jpadilla.com'
      }
    });

    for(var key in posts) {
      var post = posts[key],
        pointsDescription = post.points + ' points by ' + post.author,
        commentsDescription = '<a href="'+post.commentsLink+'">'+post.comments+' comments</a>';

      feed.item({
        title: post.title,
        link: post.link,
        description: pointsDescription + ' | ' + commentsDescription,
        date: post.createdAt,
        author: [{
          name: post.author,
          link: post.authorLink
        }]
      });
    }

    res.set('Content-Type', 'text/xml');

    if(format == 'rss') {
      data = res.send(feed.render('rss-2.0'));
    } else {
      data = res.send(feed.render('atom-1.0'));
    }
  } else {
    data = res.json(posts);
  }

  return data;
};