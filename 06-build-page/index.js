let path = require('path');
let fs = require('fs');
let fsPromise = require('fs/promises');

let mainDir = path.join(__dirname, 'assets');
let target = path.join(__dirname, 'project-dist');
let targetDir = path.join(__dirname, 'project-dist/assets');
let folderComponents = path.join(__dirname, 'components');
let folderStyles = path.join(__dirname, 'styles');
let bundle = path.join(__dirname, 'project-dist', 'style.css');


//создание директорий

fs.mkdir((path.join(__dirname, 'project-dist')), err => {
  if(err) throw err;
});
fs.mkdir((path.join(__dirname, 'project-dist', 'assets')), err => {
  if(err) throw err;
});





function copyFloader(mainDir, targetDir) { fsPromise.rm(targetDir, {recursive: true, force: true}).finally(function() {
  fsPromise.mkdir(targetDir, {
    recursive: true
  });
  fsPromise.readdir(mainDir, { withFileTypes: true}).then(function(files) {
    files.forEach(function(file) {
      let mainFileDir = path.join(mainDir, file.name);
      let copyFileDir = path.join(targetDir, file.name);
      if(file.isDirectory()) {
        copyFloader(mainFileDir,copyFileDir);
      } else {
        fsPromise.copyFile(mainFileDir,copyFileDir);
      }   
    });
    console.log('Папка скопирована!');
  });
});
}
copyFloader(mainDir, targetDir);

//сбор стилей в один файл

function copyCss() { fs.readdir(folderStyles, 'utf-8', function (error, files) {
  if (error)
  {throw error;}
  //data = '' - обнуляем файл, на случай если стили в исходниказх изменились
  fs.writeFile(bundle, '', function (error) {
    if (error) {
      throw error;
    }
  });
  files.forEach(function (file) {
    console.log('зашли!');
    if ( path.parse(path.join(folderStyles, file)).ext === '.css' ) {

      let currentFile = fs.createReadStream(path.join(folderStyles, file));
      currentFile.on('data', function(data) {
        fs.appendFile(bundle, data, function(error) {
          if (error) {
            throw error;
          }});
      });
    }
  });
});
}
copyCss();


function replaceTemplateTags() {
  fs.copyFile(`${__dirname}\\template.html`, `${target}\\index.html`, function (error) {
    if (error) throw error;
    fs.readFile(`${target}\\index.html`, 'utf8', function(error, data) {
      if(error) throw error;
      fs.readdir(folderComponents, {withFileTypes: true}, function (error, files) {
        if (error) throw error;
        files.forEach(function(file) {
          fs.readFile(`${folderComponents}\\${file.name}`, 'utf8', function(error, dataFile) {
            if(error) throw error;
            let tagName = `{{${file.name.split('.')[0]}}}`;
            data = data.replace(tagName, dataFile);
            fs.writeFile(`${target}\\index.html`, data, function (error) {
              if(error)
                console.log(error);});
          });
        });
      });
    });
  });
}
replaceTemplateTags();


