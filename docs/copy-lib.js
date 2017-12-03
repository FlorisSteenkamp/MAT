var fs = require('fs')

var getFile = require('./get-lib-file')

var path = require('path')

getFile(path.join('dist', 'mat-lib.js'))
.catch((err) => console.error(err))
.then((js) => {
  fs.writeFileSync(path.join('docs', 'dist', 'mat-lib.js'), js, {encoding: 'utf8'})
})