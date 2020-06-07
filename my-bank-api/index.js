var express = require('express');
var app = express();

app.listen(3000, () => {
  console.log('API Started!');
});

app.get('/', (req, res) => {
  res.send('Seja bem vindo ao API-MY-Bank');
});
