const connection = require('./connection');

const createService = async (name, price, description, clientid) => {
  const query =
    'INSERT INTO services(name, price, description, clientid) VALUES (?, ?, ?, ?)';
  const [createdService] = await connection.execute(query, [
    name,
    price,
    description,
    clientid,
  ]);
  return createdService;
};

const getServices = async (id) => {
  const query = 'SELECT * FROM services WHERE clientid = ?';
  const services = await connection.execute(query, [id]);

  return services[0];
};

const getServiceName = async (id) => {
  const query = 'SELECT name FROM services WHERE id = ?';
  const service = await connection.execute(query, [id]);
  return service;
};

const deleteService = async (id) => {
  const query = "DELETE FROM services WHERE id = '" + id + "'";
  const response = await connection.execute(query);
  return response;
};

const updateService = async (id, name, price, desc) => {
  const query = `UPDATE services
  SET name = '${name}', price = '${price}', description = '${desc}'
  WHERE id = ${id};`;
  const response = await connection.execute(query);
  return response;
};

module.exports = {
  createService,
  getServices,
  deleteService,
  updateService,
  getServiceName,
};
