let path = require('path');
let fs = require('fs');
fs.readdir(path.join(__dirname,'secret-folder'), {withFileTypes: true}, (err, items) => {

  if(err) throw err; // не читать содержимое папки

  items.forEach(item => {
    if (item.isFile()) {
      fs.stat(path.join(__dirname, 'secret-folder', item.name), (err, stats) => {
        const trueFile = path.parse(item.name);
        console.log(trueFile.name + ' - ' + trueFile.ext.substring(1) + ' - ' + stats.size + ' bytes');
      });
    }
  });
});