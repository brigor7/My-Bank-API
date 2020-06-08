import express from 'express';
import { promises } from 'fs';

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;

/**Consulta tranzendo todos os dados */
router.get('/', async (_, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
    logger.info(`GET /Account ${JSON.stringify(json)}`);
  } catch (err) {
    logger.error(err);
    res.sendStatus(400).send('Erro na leitura do arquivo');
  }
});

/**Consulta trazendo resultado por parametro id */
router.get('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const account = json.accounts.find(
      (account) => account.id == req.params.id
    );
    res.send(account);

    logger.info(`GET /Account/:id ${JSON.stringify(account)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let account = json.accounts.filter(
      (account) => account.id != req.params.id
    );
    json.accounts = account;

    await writeFile(global.fileName, JSON.stringify(json));
    res.send(json);

    logger.info(`DELETE /Account/:id -${JSON.stringify(json)}`);
  } catch (err) {
    logger.error(err);
    res.sendStatus(400).send({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  let params = req.body;
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let oldIndex = json.accounts.findIndex(
      (account) => account.id == params.id
    );
    json.accounts[oldIndex] = params;
    await writeFile(global.fileName, JSON.stringify(json));
    res.send(params);

    logger.info(`PUT /Account/:id -${params}`);
  } catch (err) {
    logger.error(err);
    res.sendStatus(400).send({ error: err.message });
  }
});

//Lendo os dados da API e escrevendo arquivo json
router.post('/', async (req, res) => {
  let account = req.body;
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    account = { id: json.nextId++, ...account };
    json.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(json));
    res.send(json);

    logger.info(`POST /Account -${JSON.stringify(json)}`);
  } catch (err) {
    logger.error(err);
    res.sendStatus(400).send({ error: err.message });
  }
});

/**Realização de transação com deposito e saque em balance */
router.post('/transaction', async (req, res) => {
  let params = req.body;
  try {
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let index = json.accounts.findIndex((account) => account.id == params.id);
    if (
      params.balance < 0 &&
      json.accounts[index].balance + params.balance < 0
    ) {
      throw new Error('Não há saldo suficiente');
    }
    json.accounts[index].balance += params.balance;
    writeFile(global.fileName, JSON.stringify(json));
    res.send(json);

    logger.info(`POST /Account/Transaction -${JSON.stringify(json)}`);
  } catch (err) {
    logger.error(err);
    res.sendStatus(400).send({ error: err.message });
  }
});

export default router;
