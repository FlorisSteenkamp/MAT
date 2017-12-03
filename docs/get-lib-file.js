var fs = require('fs')

var path = require('path')

module.exports = (child_path) => new Promise ((resolve, reject) => {
  //var module_path = require.resolve('ramda');
  //var folder = path.dirname(module_path);
  //var file_path = path.join(folder, child_path);
  var file_path = path.join("..", child_path);
  

  fs.readFile(file_path, 'utf8', (err, data) => {
    if (err)
      reject(err)
    else
      resolve(data)
  });
});