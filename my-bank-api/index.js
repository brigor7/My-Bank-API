var express = require('express');
var fs = require('fs');
var app = express();

app.listen(3000, () => {
  console.log('API Started!');
});

app.get('/', (_, res) => {
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    if (err) {
      const initialJson = {
        nextId: 1,
        accounts: [],
      };
      fs.writeFile('accounts.json', JSON.stringify(initialJson), (err) => {
        console.log(err);
      });
    }
  });
  res.send('Leitura ok!');
});
