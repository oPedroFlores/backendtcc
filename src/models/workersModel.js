const connection = require('./connection');

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

module.exports = {
  getWorkers,
  createWorker,
  deleteWorker,
};
