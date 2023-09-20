const mysql = require('mysql2/promise');

const userDB = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ontime',
});

module.exports = userDB;
