var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.json());

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
          console.log(err);
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
  console.log('API Started!');
});

//Lendo os dados da API e escrevendo arquivo json
app.post('/account', (req, res) => {
  let account = req.body;
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    if (!err) {
      // try {
      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account };
      json.accounts.push(account);
      fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
        if (err) {
          console.log('Erro na escrita' + err);
        } else {
          res.end;
        }
      });
      // } catch (err) {
      //  console.log(err);
      //  res.status(400).send({ error: err.message });
      // }
    } else {
      console.log('erro na leitura');
      res.send('erro na leitura');
    }
  });
});

/**Consulta tranzendo todos os dados */
app.get('/account', (_, res) => {
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      res.send(json);
    } else {
      res.end().send('Erro na leitura do arquivo');
    }
  });
});

/**Consulta trazendo resultado por parametro id */
app.get('/account/:id', (req, res) => {
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      const account = json.accounts.find(
        (account) => account.id == req.params.id
      );
      res.send(account);
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});
