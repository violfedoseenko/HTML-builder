let path = require('path');
let fs = require('fs');
const fsPromise = require('fs/promises');

//коприрование папки assets cо всем содержимым
let mainDir = path.join(__dirname, 'assets');
let target = path.join(__dirname, 'project-dist');
let targetDir = path.join(__dirname, 'project-dist/assets');
let folderComponents = path.join(__dirname, 'components');
let folderStyles = path.join(__dirname, 'styles');
let bundle = path.join(__dirname, 'project-dist', 'style.css');


async function copyFloader(mainDir, targetDir) { 
  await fsPromise.rm(targetDir, { recursive: true, force: true });
  await fsPromise.mkdir(targetDir, { recursive: true });
  let files = await fsPromise.readdir(mainDir, { withFileTypes: true}); 
  files.forEach(function(file) {
    let mainFileDir = path.join(mainDir, file.name);
    let copyFileDir = path.join(targetDir, file.name);
    if(file.isDirectory()) {
      copyFloader(mainFileDir, copyFileDir);
    } else {
      fsPromise.copyFile(mainFileDir, copyFileDir);

    }   
  });
  console.log('Папка скопирована!');
}

//сбор стилей в один файл

async function copyCss() { fs.readdir(folderStyles, 'utf-8', function (error, files) {
  if (error)
  {throw error;}
  //data = '' - обнуляем файл, на случай если стили в исходниказх изменились
  fs.writeFile(bundle, '', function (error) {
    if (error) { throw error;}
  });
  files.forEach(function (file) {
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

async function replaceTemplateTags() {
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
            console.log('перезапись');
            fs.writeFile(`${target}\\index.html`, data, function (error) {
              if(error)
                console.log(error);});
          });
        });
      });
    });
  });
}

(async () => {
  try {
    await fsPromise.rm(target, { recursive: true, force: true });
    await fsPromise.mkdir(target, { recursive: true });
    copyFloader(mainDir, targetDir);
    copyCss();
    replaceTemplateTags();
  } catch (err) {
    console.log(err);
  }
})();

