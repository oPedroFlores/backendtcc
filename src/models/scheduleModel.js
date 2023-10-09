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

  const [schedules] = await connection.execute(
    'SELECT * FROM schedules WHERE clientId = ? AND startTimeStamp >= ? AND endTimeStamp <= ?',
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
    'SELECT * FROM schedules WHERE workerId = ? AND (startTimeStamp = ? OR endTimeStamp = ?) ';
  const [allWorkerSchedules] = await connection.execute(workerQuery, [
    workerId,
    startTimeStamp,
    endTimeStamp,
  ]);
  if (allWorkerSchedules.length > 0) {
    return 'Erro. Horário Inválido!';
  }

  const query =
    'INSERT INTO schedules(clientId, userId, startTimeStamp, endTimeStamp, workerId, serviceId) VALUES (?, ?, ?, ?, ?, ?)';
  const response = await connection.execute(query, [
    id,
    userId,
    startTimeStamp,
    endTimeStamp,
    workerId,
    serviceId,
  ]);

  return response;
};

const getSchedule = async (timestamp, worker) => {
  // Pegando agenda
  const [schedule] = await connection.execute(
    'SELECT * FROM schedules WHERE workerId = ? AND startTimeStamp = ?',
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

  const serviceId = schedule[0].serviceId;
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

module.exports = {
  getSchedulesByUsername,
  setSchedule,
  getSchedule,
};
