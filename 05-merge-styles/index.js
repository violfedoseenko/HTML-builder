let fs = require('fs');
let path = require('path');

let sourceDir = path.join(__dirname, 'styles');
let bundle = path.join(__dirname, 'project-dist', 'bundle.css');
fs.readdir(sourceDir, 'utf-8', function (error, files) {
  if (error)
  {throw error;}
  //data = '' - обнуляем файл, на случай если стили в исходниказх изменились
  fs.writeFile(bundle, '', function (error) {
    if (error) {
      throw error;
    }
  });
  files.forEach(function (file) {
    if ( path.parse(path.join(sourceDir, file)).ext === '.css' ) {

      let currentFile = fs.createReadStream(path.join(sourceDir, file));
      currentFile.on('data', function(data) {
        fs.appendFile(bundle, data, function(error) {
          if (error) {
            throw error;
          }});
      });
    }
  });
});
