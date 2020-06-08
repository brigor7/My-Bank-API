var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.json());

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

app.get('/', (_, res) => {
  res.send('GET account ok!');
});
