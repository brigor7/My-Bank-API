var express = require('express');
var router = express.Router();

var fs = require('fs').promises;

/**Consulta tranzendo todos os dados */
router.get('/', (_, res) => {
  fs.readFile(global.fileName, 'utf8')
    .then((data) => {
      let json = JSON.parse(data);
      res.send(json);
    })
    .catch((error) => {
      res.end().send('Erro na leitura do arquivo');
    });
});

/**Consulta trazendo resultado por parametro id */
router.get('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8')
    .then((data) => {
      let json = JSON.parse(data);
      const account = json.accounts.find(
        (account) => account.id == req.params.id
      );
      res.send(account);
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

router.delete('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8')
    .then((data) => {
      let json = JSON.parse(data);
      let account = json.accounts.filter(
        (account) => account.id != req.params.id
      );
      json.accounts = account;

      fs.writeFile(global.fileName, JSON.stringify(json));
      res.send(json);
    })
    .catch((err) => {
      res.sendStatus(400).send({ error: err.message });
    });
});

router.put('/:id', (req, res) => {
  let params = req.body;
  fs.readFile(global.fileName, 'utf8')
    .then((data) => {
      let json = JSON.parse(data);
      let oldIndex = json.accounts.findIndex(
        (account) => account.id == params.id
      );
      json.accounts[oldIndex] = params;
      fs.writeFile(global.fileName, JSON.stringify(json));
      res.send(params);
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

//Lendo os dados da API e escrevendo arquivo json
router.post('/', (req, res) => {
  let account = req.body;
  fs.readFile(global.fileName, 'utf8')
    .then((data) => {
      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account };
      json.accounts.push(account);
      fs.writeFile(global.fileName, JSON.stringify(json));
      res.send(json);
    })
    .catch((err) => {
      res.sendStatus(400).send({ error: err.message });
    });
});

/**Realização de transação com deposito e saque em balance */
router.post('/transaction', (req, res) => {
  let params = req.body;
  fs.readFile(global.fileName, 'utf8')
    .then((data) => {
      let json = JSON.parse(data);
      let index = json.accounts.findIndex((account) => account.id == params.id);
      if (
        params.balance < 0 &&
        json.accounts[index].balance + params.balance < 0
      ) {
        throw new Error('Não há saldo suficiente');
      }
      json.accounts[index].balance += params.balance;
      fs.writeFile(global.fileName, JSON.stringify(json));
      res.send(json);
    })
    .catch((error) => {
      res.status(400).send({ error: err.message });
    });
});

module.exports = router;
