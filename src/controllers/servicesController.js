const servicesModel = require('../models/servicesModel');

const createService = async (req, res) => {
  // Se os campos são vazios
  const name = req.body.name;
  let desc;
  if (!req.body.desc) {
    desc = '';
  } else {
    desc = req.body.desc;
  }
  const price = req.body.price;
  if (!name || name == '' || !price)
    return res.status(403).json({ message: 'Preencha os campos!' });

  // Trocando virgulas por ponto no price
  const formatedPrice = price.replace(/,/g, '.');

  // Verificando se há apenas numeros no price
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  if (!priceRegex.test(formatedPrice)) {
    return res.status(403).json({
      message:
        'O preço precisa ser um número e não conter mais de duas casas decimais!',
    });
  }

  // Se o nome é pequeno
  if (name.length < 3)
    return res.status(403).json({ message: 'O nome é muito curto!' });

  const createdService = await servicesModel.createService(
    name,
    formatedPrice,
    desc,
    req.user.id,
  );

  return res.status(201).json({ message: 'Criado com sucesso!' });
};

const getServices = async (req, res) => {
  const id = req.user.id;
  const services = await servicesModel.getServices(id);

  return res.status(201).json(services);
};

const deleteService = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  const serviceId = req.body.serviceId;

  if (!userId || !serviceId) {
    return res.status(403).json({ message: 'Dados incompletos!' });
  }

  const services = await servicesModel.getServices(userId);

  // Encontrando o worker desejado pela requisição dentro da lista de trabalhadores deste cliente
  const service = services.find(
    (service) => service.id === parseInt(serviceId, 10),
  );

  if (!service || role != 2) {
    return res.status(404).json({ message: 'Serviço não encontrado.' });
  }

  const deletedService = await servicesModel.deleteService(serviceId);

  return res.status(202).json({ message: 'Serviço deletado com sucesso!' });
};

module.exports = {
  createService,
  getServices,
  deleteService,
};
