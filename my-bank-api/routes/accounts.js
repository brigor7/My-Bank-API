var express = require('express');
var router = express.Router();

var fs = require('fs');

//Lendo os dados da API e escrevendo arquivo json
router.post('/', (req, res) => {
  let account = req.body;
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account };
      json.accounts.push(account);
      fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
        if (err) throw err;
      });
      res.end;
    } catch (error) {
      res.status(400).send({ error: err.message });
    }
  });
});

/**Consulta tranzendo todos os dados */
router.get('/', (_, res) => {
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      res.send(json);
    } catch (error) {
      res.end().send('Erro na leitura do arquivo');
    }
  });
});

/**Consulta trazendo resultado por parametro id */
router.get('/:id', (req, res) => {
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      const account = json.accounts.find(
        (account) => account.id == req.params.id
      );
      res.send(account);
    } catch (error) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.delete('/:id', (req, res) => {
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      let account = json.accounts.filter(
        (account) => account.id != req.params.id
      );
      json.accounts = account;
      fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
        res.status(400).send({ error: err.message });
      });
      res.send(json);
    } catch (error) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.put('/:id', (req, res) => {
  let newAccount = req.body;
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      let oldIndex = json.accounts.findIndex(
        (account) => account.id == newAccount.id
      );
      json.accounts[oldIndex] = newAccount;
      fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
        res.status(400).send({ error: err.message });
      });
      res.send(newAccount);
    } catch (error) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.post('/transaction', (req, res) => {
  let putAccount = req.body;
  fs.readFile('accounts.json', 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      let index = json.accounts.findIndex(
        (account) => account.id == putAccount.id
      );
      json.accounts[index].balance += putAccount.balance;
      fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
        res.status(400).send({ error: err.message });
      });
      res.send(json);
    } catch (error) {
      res.status(400).send({ error: err.message });
    }
  });
});

module.exports = router;
