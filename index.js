var http = require('http')
  , https = require('https')
  , url = require('url')
  , gm = require('gm')

module.exports = function(basePath) {
  var parsedBasePath = url.parse(basePath)
    , get = parsedBasePath.protocol === 'https:' ? https.get : http.get

  return http.createServer(function(req, res) {
    var imageStream
      , params = parseParams(req.url)
      , options = {
          hostname: parsedBasePath.hostname,
          port: parsedBasePath.port,
          path: (parsedBasePath.path + params.imagePath).replace('//', '/')
        }

    get(options, function(r) {
      if (r.statusCode !== 200) {
        res.statusCode = r.statusCode
        r.pipe(res)
        return
      }

      if (!params.size)
        return r.pipe(res)

      imageStream = gm(r)

      // Maintain aspect ratio if only provided the image width
      if (!params.size.height) {
        imageStream
          .resize(params.size.width)
      }

      // Otherwise resize and crop the image
      else {
        imageStream
          .resize(params.size.width, params.size.height, '^')
          .gravity('Center')
          .crop(params.size.width, params.size.height)
      }

      imageStream
        .stream()
        .pipe(res)
    })
  })
}

var widthRegex = /^\/(\d+)*\//
  , widthHeightRegex = /^\/(\d+)x?(\d+)*\//

function parseParams(url) {
  var params = {
        imagePath: url.replace(widthRegex, '/').replace(widthHeightRegex, '/')
      }
    , sizeMatch

  if (sizeMatch = url.match(widthRegex)) {
    params.size = {
      width: sizeMatch[1]
    }
  }
  else if (sizeMatch = url.match(widthHeightRegex)) {
    params.size = {
      width: sizeMatch[1],
      height: sizeMatch[2]
    }
  }

  return params
}