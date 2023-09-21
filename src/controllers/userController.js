const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const getAll = async (req, res) => {
  const users = await userModel.getAll();

  const simplifiedUsers = users.map((user) => ({
    idusers: user.idusers,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return res.status(200).json(simplifiedUsers);
};

const createUser = async (req, res) => {
  const response = await userModel.createUser(req.body);
  return res.status(201).json(response);
};

const getUser = async (req, res) => {
  return res.status(201).json(req.user);
};

const authenticate = async (req, res) => {
  // Verificando email e senha se estão preenchidos
  if (req.body.email == undefined || req.body.password == undefined) {
    return res.json({ message: 'preencha os campos!' });
  } else {
    const { email, password } = req.body;
    // Procurando o email cadastrado
    const returnedUser = await userModel.findOne(email);
    // Encontrou usuário
    if (returnedUser != null) {
      // Caso a senha esteja correta
      const username = returnedUser.username;
      const name = returnedUser.name;
      const role = returnedUser.role;
      const idusers = returnedUser.idusers;
      const correctPassword = await userModel.authenticateUser(email, password);
      if (correctPassword) {
        // Gerando token de acesso
        const acessToken = jwt.sign(
          {
            username: username,
            role: role,
            name: name,
            email: email,
          },
          'tcc',
          { expiresIn: '12h' },
        );
        res.json({
          username: username,
          role: role,
          name: name,
          email: email,
          acessToken: acessToken,
        });
      } else {
        return res.status(403).json({
          message: 'Email ou senha incorretos!',
        });
      }
    } else {
      return res.status(403).json({
        message: 'Email não cadastrado',
      });
    }
  }
};

const login = (req, res) => {
  res.redirect('/users');
};

const deleteUser = async (req, res) => {
  deletedEmail = req.body.email;
  const users = await userModel.getAll();
  reqUser = req.user;
  const userExists = await userModel.findOne(deletedEmail);
  if (userExists == null) {
    return res.status(403).json('Este email não está cadastrado!');
  }
  if (reqUser.role == 2 || reqUser.email == deletedEmail) {
    const response = await userModel.deleteUser(deletedEmail);
    return res.status(200).json(response);
  } else {
    return res.status(403).json('Não está autorizado a deletar este usuário!');
  }
};

module.exports = {
  getAll,
  createUser,
  authenticate,
  login,
  deleteUser,
  getUser,
};
