const connection = require('./connection');
const bcrypt = require('bcryptjs');

const getAll = async () => {
  const users = await connection.execute('SELECT * FROM users');

  return users[0];
};

const createUser = async (user) => {
  const { username, email, name, password } = user;
  let response = 'Email já cadastrado';
  const [users] = await connection.execute('SELECT * FROM users');
  // Se já existe o email:
  for (const user of users) {
    if (user.email == email) {
      return response;
    }
  }
  // Se já existe o username:
  for (const user of users) {
    if (user.username == username) {
      let response = 'Username Já cadastrado';
      return response;
    }
  }

  // se tudo der certo:
  const querry =
    'INSERT INTO users(username, email, name, password, role) VALUES (?, ?, ?, ?, ?)';
  const [createdUser] = await connection.execute(querry, [
    username,
    email,
    name,
    password,
    0,
  ]);
  return createdUser;
};

const findOne = async (email) => {
  const [users] = await connection.execute('SELECT * FROM users');

  for (const user of users) {
    if (user.email == email) {
      return user;
    }
  }
  return null;
};

const authenticateUser = async (email, password) => {
  const [users] = await connection.execute('SELECT * FROM users');

  for (const user of users) {
    if (user.email == email) {
      const correctPass = bcrypt.compareSync(password, user.password);
      if (correctPass) {
        return true;
      }
    }
  }
  return null;
};

const deleteUser = async (email) => {
  const query = "DELETE FROM users WHERE email = '" + email + "'";

  const response = await connection.execute(query);
  return response;
};

module.exports = {
  getAll,
  createUser,
  findOne,
  authenticateUser,
  deleteUser,
};
