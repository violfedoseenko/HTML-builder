
let path = require('path');
let fs = require('fs/promises');
let mainDir = path.join(__dirname, 'files');
let copyDir = path.join(__dirname, 'files-copy');
//force: true используется, чтобы не выдавало ошибку, если папки не существует
//recursive помогает избежать ошибки, когда директория уже создана
fs.rm(copyDir, {recursive: true, force: true}).finally(function() {
  fs.mkdir(copyDir, {
    recursive: true
  });
  fs.readdir(mainDir, { withFileTypes: true }).then(function(files) {
    files.forEach(function(file) {
      if (file.isFile()) {
        let mainFileDir = path.join(mainDir, file.name);
        let copyFileDir = path.join(copyDir, file.name);
        fs.copyFile(mainFileDir, copyFileDir);
      }
    });
  });

});
