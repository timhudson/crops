var http = require('http')
  , static = require('node-static')
  , crops = require('../index')

var fileServer = new static.Server(__dirname)

http.createServer(function(req, res) {
  req.addListener('end', function() {
    fileServer.serve(req, res)
  }).resume()
}).listen(3001)

var server = crops('http://localhost:3001')

server.listen(3000)