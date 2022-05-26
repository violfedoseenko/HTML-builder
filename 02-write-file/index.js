let path = require('path');
let fs = require('fs');
let { stdout, stdin, exit } = require('process');

let writeStream = fs.createWriteStream(path.join(__dirname, 'my_text.txt'));

stdout.write('Введите текст:');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    finishFunk();
  }
  writeStream.write(data);
});

process.on('SIGINT', finishFunk);
function finishFunk() {
  stdout.write('Запись добавлена в файл. До встречи!');
  exit();
}
