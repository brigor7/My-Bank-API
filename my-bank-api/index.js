var express = require('express');
var fs = require('fs').promises;
var app = express();
var accountsRouter = require('./routes/accounts.js');

global.fileName = 'accounts.json';

app.use(express.json());
app.use('/account', accountsRouter);

/**Levantando o servidor e criando o arquivo json caso não exista*/
app.listen(3000, async () => {
  try {
    await fs.readFile(global.fileName, 'utf8');
    console.log('API Started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    await fs
      .writeFile(global.fileName, JSON.stringify(initialJson))
      .catch((err) => {
        console.log(err);
      });
  }
});
