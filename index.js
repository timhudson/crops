var http = require('http')
  , https = require('https')
  , url = require('url')
  , querystring = require('querystring')
  , gm = require('gm')

module.exports = function(basePath) {
  var parsedBasePath = url.parse(basePath)
    , get = parsedBasePath.protocol === 'https:' ? https.get : http.get

  return http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url)
      , query = querystring.parse(parsedUrl.query)
      , size = query.size ? query.size.split('x') : undefined
      , options = {
          hostname: parsedBasePath.hostname,
          port: parsedBasePath.port,
          path: (parsedBasePath.path + parsedUrl.pathname).replace('//', '/')
        }

    get(options, function(r) {
      var imageStream = gm(r)

      if (r.statusCode !== 200) {
        res.statusCode = r.statusCode
        r.pipe(res)
        return
      }

      if (size) {
        imageStream
          .resize(size[0], size[1], '^')
          .gravity('Center')
          .crop(size[0], size[1])
      }
      
      imageStream
        .stream()
        .pipe(res)
    })
  })
}
