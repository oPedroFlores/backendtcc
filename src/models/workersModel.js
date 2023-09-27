const connection = require('./connection');
const servicesModel = require('../models/servicesModel');
const { response } = require('express');

const getWorkers = async (id) => {
  const query = 'SELECT * FROM workers WHERE clientid = ?';
  const workers = await connection.execute(query, [id]);

  return workers[0];
};

const createWorker = async (name, clientId) => {
  const query = 'INSERT INTO workers(name, clientid) VALUES (?, ?)';
  const [createdWorker] = await connection.execute(query, [name, clientId]);
  return createdWorker;
};

const deleteWorker = async (id) => {
  const query = "DELETE FROM workers WHERE id = '" + id + "'";
  const response = await connection.execute(query);
  return response;
};

const getWorkerServices = async (id) => {
  const query = 'SELECT * FROM workerservices WHERE workerid = ?';
  const response = await connection.execute(query, [id]);
  return response;
};

const updateWorkerServices = async (workerid, services) => {
  // Deletando os atuais services deste worker
  const [isServices] = await getWorkerServices(workerid);
  if (isServices.length > 0) {
    const query =
      "DELETE FROM workerservices WHERE workerid = '" + workerid + "'";
    const response = await connection.execute(query);
  }

  for (const service of services[0]) {
    if (service.added === 'true') {
      const query =
        'INSERT INTO workerservices(workerid, serviceid, serviceName) VALUES (?, ?, ?)';
      const [name] = await servicesModel.getServiceName(service.serviceID);
      const stringName = name[0]['name'];
      const response = await connection.execute(query, [
        workerid,
        service.serviceID,
        stringName,
      ]);
    }
  }
  return;
};

const updateWorker = async (workerid, name, services) => {
  const query = `UPDATE workers
  SET name = '${name}'
  WHERE id = ${workerid};`;
  const response2 = updateWorkerServices(workerid, services);
  const response = await connection.execute(query);
  return response;
};

module.exports = {
  getWorkers,
  createWorker,
  deleteWorker,
  getWorkerServices,
  updateWorker,
};
