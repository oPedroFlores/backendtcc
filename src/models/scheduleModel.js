const connection = require('./connection');

const getSchedulesByUsername = async (username, date) => {
  const partes = date.split('-');
  const ano = partes[0];
  const mes = partes[1];
  const dia = partes[2];
  const timeStampDate = Date.UTC(ano, mes - 1, dia);
  const EndtimeStampDate = Date.UTC(ano, mes - 1, Number(dia) + 1);
  const [clientidString] = await connection.execute(
    'SELECT idusers FROM users WHERE username = ?',
    [username],
  );
  const id = clientidString[0].idusers;

  const [calendar] = await connection.execute(
    'SELECT * FROM calendar WHERE clientID = ?',
    [id],
  );
  // 'SELECT * FROM schedules WHERE clientId = ? AND startTimeStamp >= ? AND endTimeStamp <= ?',
  const [schedules] = await connection.execute(
    'SELECT sch.*, ws.workerID as workerId, ws.serviceID as serviceId, w.clientid as clientId FROM schedules sch JOIN workerservices ws ON sch.workerServiceId = ws.id JOIN workers w ON ws.workerID = w.id WHERE w.clientid = ? AND sch.startTimeStamp >= ? AND sch.endTimeStamp <= ?;',
    [id, timeStampDate, EndtimeStampDate],
  );

  const object = {
    calendar: calendar,
    schedules: schedules,
  };

  return object;
};

const setSchedule = async (
  userId,
  clientUsername,
  serviceId,
  workerId,
  startTimeStamp,
  endTimeStamp,
) => {
  const [clientidString] = await connection.execute(
    'SELECT idusers FROM users WHERE username = ?',
    [clientUsername],
  );
  const id = clientidString[0].idusers;

  // Verificar se já existe este horário para este worker
  const workerQuery =
    'SELECT * FROM schedules WHERE workerServiceId IN (SELECT id FROM workerservices WHERE workerID = ? AND (startTimeStamp = ? OR endTimeStamp = ?));';
  const [allWorkerSchedules] = await connection.execute(workerQuery, [
    workerId,
    startTimeStamp,
    endTimeStamp,
  ]);
  if (allWorkerSchedules.length > 0) {
    return 'Erro. Horário Inválido!';
  }

  const wsQuery =
    'SELECT id from workerservices WHERE workerID = ? AND serviceID = ?';
  const [wsId] = await connection.execute(wsQuery, [workerId, serviceId]);
  const query =
    'INSERT INTO schedules(userId, startTimeStamp, endTimeStamp, workerServiceId) VALUES (?, ?, ?, ?)';
  const response = await connection.execute(query, [
    userId,
    startTimeStamp,
    endTimeStamp,
    wsId[0].id,
  ]);

  return response;
};

const getSchedule = async (timestamp, worker) => {
  // Pegando agenda
  const [schedule] = await connection.execute(
    'SELECT * FROM schedules WHERE workerServiceId IN (SELECT id FROM workerservices WHERE workerID = ?) AND startTimeStamp = ?; ',
    [worker, timestamp],
  );
  if (schedule.length === 0 || schedule.length > 1) {
    return 'Erro na pesquisa!';
  }

  const userId = schedule[0].userId;
  // Pegando informações do usuário cliente final
  const [info] = await connection.execute(
    'SELECT * FROM users WHERE idusers = ?',
    [userId],
  );
  if (info.length === 0) {
    return 'Erro na pesquisa!';
  }

  // Pegando nome do serviço
  let [serviceId] = await connection.execute(
    'SELECT serviceID FROM workerservices WHERE id = ?;',
    [schedule[0].workerServiceId],
  );
  serviceId = serviceId[0].serviceID;

  const [serviceName] = await connection.execute(
    'SELECT name FROM services WHERE id = ?',
    [serviceId],
  );

  const response = {
    service: serviceName[0].name,
    user: info[0].name,
    email: info[0].email,
  };

  return response;
};

const getUserSchedules = async (user) => {
  const userId = user.id;
  const [schedules] = await connection.execute(
    'SELECT s.userId, ws.id AS workerServiceId, w.name AS workerName, ser.name AS serviceName, u.username AS clientUsername, s.startTimeStamp, s.endTimeStamp FROM schedules s JOIN workerservices ws ON s.workerServiceId = ws.id JOIN workers w ON ws.workerID = w.id JOIN services ser ON ws.serviceID = ser.id JOIN users u ON w.clientid = u.idusers WHERE s.userId = ?',
    [userId],
  );
  return schedules;
};

module.exports = {
  getSchedulesByUsername,
  setSchedule,
  getSchedule,
  getUserSchedules,
};
