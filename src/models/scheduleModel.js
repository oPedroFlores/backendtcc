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

module.exports = {
  getSchedulesByUsername,
  setSchedule,
};
