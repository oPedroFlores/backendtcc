const connection = require('./connection');

const getCalendar = async (id) => {
  const users = await connection.execute(
    "SELECT * FROM calendar WHERE clientID = '" + id + "'",
  );

  return users[0];
};

const deleteCalendar = async (id) => {
  const query = "DELETE FROM calendar WHERE clientID = '" + id + "'";
  return await connection.execute(query);
};

const createCalendar = async (clientId, calendar) => {
  const query =
    'INSERT INTO calendar(clientId, startTime, endTime, startBreakTime, endBreakTime, day) VALUES (?, ?, ?, ?, ?, ?)';
  for (const day of calendar) {
    if (
      day.day == 'seg' ||
      day.day == 'ter' ||
      day.day == 'qua' ||
      day.day == 'qui' ||
      day.day == 'sex' ||
      day.day == 'sab' ||
      day.day == 'dom'
    ) {
      await connection.execute(query, [
        clientId,
        day.startTime,
        day.endTime,
        day.startBreakTime,
        day.endBreakTime,
        day.day,
      ]);
    }
  }

  return 'Calendário criado!';
};

module.exports = {
  getCalendar,
  deleteCalendar,
  createCalendar,
};
