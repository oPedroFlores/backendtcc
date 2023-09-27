const workersModel = require('../models/workersModel');

const createWorker = async (req, res) => {
  // Se o nome é vazio
  const name = req.body.name;
  if (!name || name == '')
    return res.status(403).json({ message: 'Preencha os campos!' });

  // Se o nome é pequeno
  if (name.length < 3)
    return res.status(403).json({ message: 'O nome é muito curto!' });

  const userExists = await workersModel.createWorker(name, req.user.id);

  return res.status(201).json({ message: 'Criado com sucesso!' });
};

const getWorkers = async (req, res) => {
  try {
    const id = req.user.id;
    let workers = await workersModel.getWorkers(id);
    for (const worker of workers) {
      const [services] = await workersModel.getWorkerServices(worker.id);

      worker.services = services; // Adiciona a chave "services" ao funcionário
    }

    return res.status(200).json(workers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar os trabalhadores' });
  }
};

const deleteWorker = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  const workerId = req.body.workerId;

  if (!userId || !workerId) {
    return res.status(403).json({ message: 'Dados incompletos!' });
  }

  const workers = await workersModel.getWorkers(userId);

  // Encontrando o worker desejado pela requisição dentro da lista de trabalhadores deste cliente
  const worker = workers.find((worker) => worker.id === parseInt(workerId, 10));

  if (!worker || role != 2) {
    return res.status(404).json({ message: 'Funcionário não encontrado.' });
  }

  const deletedWorker = await workersModel.deleteWorker(workerId);

  return res.status(202).json({ message: 'Funcionário deletado com sucesso!' });
};

const updateWorker = async (req, res) => {
  const name = req.body.name;
  const services = req.body.services;
  const workerid = req.body.id;
  if (!workerid) {
    return res.status(403).json({ message: 'Preencha todos os campos!' });
  }
  // verificando se o worker solicitado para alteração é deste cliente
  const workers = await workersModel.getWorkers(req.user.id);
  let idEncontrado = false;
  for (const worker of workers) {
    if (Number(worker.id) === Number(workerid)) {
      if (worker.clientid === req.user.id) {
        idEncontrado = true;
        break; // Podemos sair do loop assim que encontrarmos uma correspondência
      }
    }
  }
  if (!idEncontrado) {
    return res.status(403).json({
      message: 'Você não tem permissão para alterar este funcionário!',
    });
  }
  if (!name) {
    return res.status(403).json({ message: 'Preencha os campos!' });
  }
  const updatedWorker = await workersModel.updateWorker(
    workerid,
    name,
    services,
  );

  return res.status(202).json(updatedWorker);
};

module.exports = {
  createWorker,
  getWorkers,
  deleteWorker,
  updateWorker,
};
