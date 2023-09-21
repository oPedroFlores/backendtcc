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

module.exports = {
  createWorker,
  getWorkers,
};
