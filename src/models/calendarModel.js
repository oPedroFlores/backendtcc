const connection = require('./connection');

const getCalendar = async (id) => {
  const users = await connection.execute("SELECT * FROM calendar WHERE clientID = '" + id + "'");

  return users[0];
};



module.exports = {
    getCalendar,
  };
  