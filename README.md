# HackerDesignerNews

This is an aggregator for LayerVault's [Designer News](https://news.layervault.com/stories) and Y Combinator's [Hacker News](https://news.ycombinator.com).

The `cron.js` script handles fetching data from HN and DN, normalizing and storing it in MongoDB.

The `server.js` script runs an express server serving the following endpoints:

- **/top** - Loads all current top posts
- **/top/hn** - Loads all current top Hacker News posts
- **/top/dn** - Loads all current top Designer News posts

### Example response

```json
[{
    "author": "Sean H.",
    "authorLink": "https://news.layervault.com/u/3582/sean-hendrickson",
    "comments": 1,
    "commentsLink": "https://news.layervault.com/stories/11137-medium-10--a-new-storytelling-experience",
    "createdAt": "2013-12-04T22:12:09.143Z",
    "link": "https://medium.com/beautiful-stories/8d615d86ac04",
    "points": 35,
    "position": 1,
    "source": "designer_news",
    "title": "Medium 1.0 — A New Storytelling Experience",
    "updatedAt": "2013-12-05T14:10:15.138Z"
}, {
    "author": "evilpie",
    "authorLink": "https://news.ycombinator.com/user?id=evilpie",
    "comments": 29,
    "commentsLink": "https://news.ycombinator.com/item?id=6853811",
    "createdAt": "2013-12-05T11:41:41.454Z",
    "link": "http://billmccloskey.wordpress.com/2013/12/05/multiprocess-firefox/",
    "points": 121,
    "position": 1,
    "source": "hacker_news",
    "title": "Multiprocess Firefox",
    "updatedAt": "2013-12-05T14:10:14.904Z"
}]
```

## Scraper
```
$ node cron.js
[START] running cron
[FINISH] resetTopPosts
[FINISH] createOrUpdatePosts
[FINISH] running cron
```

## Server
```
$ node server.js
```
