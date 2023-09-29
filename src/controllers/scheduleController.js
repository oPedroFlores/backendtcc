const workersModel = require('../models/workersModel');
const servicesModel = require('../models/servicesModel');

const getWorkers = async (req, res) => {
  try {
    const id = req.body.clientId;
    if (!id) {
      return res.status(403).json({ message: 'Preencha os campos!' });
    }
    let workers = await workersModel.getWorkers(id);
    for (const worker of workers) {
      const [services] = await workersModel.getWorkerServices(worker.id);

      worker.services = services; // Adiciona a chave "services" ao funcionário
    }

    return res.status(200).json(workers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar os trabalhadores' });
  }
};

const getServices = async (req, res) => {
  try {
    const id = req.body.clientId;
    if (!id) {
      return res.status(403).json({ message: 'Preencha os campos!' });
    }
    const services = await servicesModel.getServices(id);

    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar os serviços' });
  }
};

module.exports = {
  getWorkers,
  getServices,
};
