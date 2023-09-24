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
  const id = req.user.id;
  const workers = await workersModel.getWorkers(id);

  return res.status(200).json(workers);
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

module.exports = {
  createWorker,
  getWorkers,
  deleteWorker,
};
