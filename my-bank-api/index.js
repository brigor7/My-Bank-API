var express = require('express');
var fs = require('fs');
var app = express();
var accountsRouter = require('./routes/accounts.js');

app.use(express.json());
app.use('/account', accountsRouter);

/**Levantando o servidor e criando o arquivo json caso não exista*/
app.listen(3000, () => {
  try {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: [],
        };
        fs.writeFile('accounts.json', JSON.stringify(initialJson), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
  console.log('API Started!');
});
