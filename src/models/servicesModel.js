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

const getServicesByUsername = async (username) => {
  const [clientidString] = await connection.execute(
    'SELECT idusers FROM users WHERE username = ?',
    [username],
  );
  const id = clientidString[0].idusers;
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
  const query2 = "DELETE FROM workerservices WHERE serviceID = '" + id + "'";
  const response = await connection.execute(query2);
  const response2 = await connection.execute(query);
  return response;
};

const updateService = async (id, name, price, desc) => {
  const query = `UPDATE services
  SET name = '${name}', price = '${price}', description = '${desc}'
  WHERE id = ${id};`;
  const response = await connection.execute(query);
  return response;
};

const servicesInfo = async (user) => {
  const clientId = user.id;
  const query =
    'SELECT se.id AS id, se.name AS name, COUNT(s.id) AS numberOfRegistrations FROM users u JOIN services se ON u.idusers = se.clientid LEFT JOIN workerservices ws ON se.id = ws.serviceID LEFT JOIN schedules s ON ws.id = s.workerServiceId WHERE u.idusers = ? GROUP BY se.id, se.name';
  const [response] = await connection.execute(query, [clientId]);
  return response;
};

module.exports = {
  createService,
  getServices,
  deleteService,
  updateService,
  getServiceName,
  getServicesByUsername,
  servicesInfo,
};
