crops
=====

> Server for dynamically resizing images on the fly

Point at any valid file server and crops will stream the response through Graphicsmagick to the client. Crops sits well between an image file server and a CDN.

[![build status](https://secure.travis-ci.org/timhudson/crops.png)](http://travis-ci.org/timhudson/crops)

install
-------

With [npm](https://npmjs.org) do:

```
npm install crops
```

Crops requires [graphicsmagick](http://www.graphicsmagick.org/) so make sure that is [installed](https://www.google.com/search?q=installing+graphicsmagick)

example
-------

```javascript
var crops = require('crops')

crops('https://npm-crops.s3.amazonaws.com/').listen(3000)
```

```bash
$ curl http://localhost:3000/image.jpg
$ curl http://localhost:3000/160x90/image.jpg
$ curl http://localhost:3000/400x220/image.jpg
```

license
-------

MIT
