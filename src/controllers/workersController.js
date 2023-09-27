const workersModel = require('../models/workersModel');
const servicesModel = require('../models/servicesModel');

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
      idEncontrado = true;
      break; // Podemos sair do loop assim que encontrarmos uma correspondência
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

const workerServices = async (req, res) => {
  // verificando se o worker solicitado para alteração é deste cliente
  const workers = await workersModel.getWorkers(req.user.id);
  let idEncontrado = false;
  for (const worker of workers) {
    if (Number(worker.id) === Number(req.body.workerId)) {
      idEncontrado = true;
      break; // Podemos sair do loop assim que encontrarmos uma correspondência
    }
  }
  if (!idEncontrado) return res.status(403).json('Sem permissão!');

  // Pegando todos os serviços deste cliente
  const clientId = req.user.id;
  const allServices = await servicesModel.getServices(clientId);
  // Pegando todos os serviços deste funcionário
  const workerId = req.body.workerId;
  const [workerServices] = await workersModel.getWorkerServices(workerId);

  const updatedAllServices = allServices.map((service) => {
    // Verifique se o serviço com o mesmo id existe em workerServices
    const existsInWorkerServices = workerServices.some(
      (workerService) => workerService.serviceID === service.id,
    );

    // Adicione a propriedade "added" com base na verificação
    return {
      ...service,
      added: existsInWorkerServices ? 'true' : 'false',
    };
  });

  // Agora, updatedAllServices conterá os serviços com a propriedade "added" atualizada
  return res.json(updatedAllServices);
};

module.exports = {
  createWorker,
  getWorkers,
  deleteWorker,
  updateWorker,
  workerServices,
};
