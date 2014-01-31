var test = require('tap').test
  , async = require('async')
  , http = require('http')
  , static = require('node-static')
  , request = require('request')
  , crops = require('../index')

var fileServer = new static.Server(__dirname + '/../example')

var staticServer = http.createServer(function(req, res) {
  req.addListener('end', function() {
    fileServer.serve(req, res)
  }).resume()
}).listen(3001)

var server = crops('http://localhost:3001').listen(3000)

test('crops', function(t) {
  t.plan(5)
  t.ok(server instanceof http.Server, 'returns instance of http.Server')

  async.parallel([
    function(cb) {
      request('http://localhost:3000/image.jpg', function(err, res, body) {
        t.ok(body.length === 69459, 'returns uncropped image when no `size` is specified')
        cb(err)
      })
    },
    function(cb) {
      request('http://localhost:3000/10/image.jpg', function(err, res, body) {
        t.ok(body.length < 1000 && body.length > 100, 'resizes image according to width provided')
        cb(err)
      })
    },
    function(cb) {
      request('http://localhost:3000/1000/image.jpg', function(err, res, body) {
        t.ok(body.length < 50000 && body.length > 45000, 'resizes image by width and maintains aspect ratio')
        cb(err)
      })
    },
    function(cb) {
      request('http://localhost:3000/100x1000/image.jpg', function(err, res, body) {
        t.ok(body.length < 13000 && body.length > 10000, 'resizes image according to width and height provided')
        cb(err)
      })
    },
    function(cb) {
      request('http://localhost:3000/hello.jpg', function(err, res, body) {
        t.equal(res.statusCode, 404, 'returns status code when no image is available at the given path')
        cb(err)
      })
    }
  ],
  function(err) {
    t.end()

    server.close()
    staticServer.close()
  })
})
