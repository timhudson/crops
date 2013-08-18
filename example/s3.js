var crops = require('../index')

crops('http://npm-crops.s3.amazonaws.com/').listen(3000)

// curl http://localhost:3000/ben.jpg?size=160x90