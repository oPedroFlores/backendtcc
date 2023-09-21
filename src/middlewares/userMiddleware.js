const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createError = (fieldName, maxLength) => ({
  status: 400,
  message: maxLength
    ? `O campo ${fieldName} é grande demais! (máximo de ${maxLength} caracteres)`
    : `O campo ${fieldName} é necessário!`,
});

const validateUser = async (req, res, next) => {
  const { body } = req;

  const validateField = (field, fieldName, maxLength) => {
    if (field == undefined || field === '') {
      return createError(fieldName);
    }
    if (maxLength && field.length > maxLength) {
      return createError(fieldName, maxLength);
    }
    return null; // Sem erros
  };

  const fieldValidations = [
    validateField(body.username, 'username', 45),
    validateField(body.name, 'nome', 200),
    validateField(body.email, 'email', 200),
    validateField(body.password, 'senha', 200),
  ];

  const errors = fieldValidations.filter((result) => result !== null);

  if (errors.length > 0) {
    return res.status(errors[0].status).json({ message: errors[0].message });
  }

  // Verificando se já existe email ou senha

  const users = await userModel.getAll();
  const emails = [];
  const usernames = [];

  for (const user of users) {
    emails.push(user.email);
    usernames.push(user.username);
  }
  // Se o email já existe no banco de dados
  if (emails.includes(body.email)) {
    return res.status(403).json({ message: 'Este email já foi cadastrado' });
  }
  // Se o username já existe no banco de dados
  if (usernames.includes(body.username)) {
    return res.status(403).json({ message: 'Este username já foi cadastrado' });
  }

  // Validar email por regex
  var emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!body.email.match(emailRegex)) {
    return res.status(403).json({ message: 'Email inválido!' });
  }
  // Validar username por regex
  var usernameRegex = /^[a-zA-Z\-]+$/;
  if (!body.username.match(usernameRegex)) {
    return res.status(403).json({ message: 'Username inválido!' });
  }

  // Validar name por regex
  const regexNome = /^[\p{L}\s]+$/u;
  if (!body.name.match(regexNome)) {
    return res.status(403).json({ message: 'Nome inválido!' });
  }

  // Validando senha por regex
  const regexPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  if (!body.password.match(regexPass)) {
    return res.status(400).json({
      message:
        'Senha inválida! A senha precisa ter entre 7 a 15 caracteres, conter pelo menos um número e um caracter especial.',
    });
  }

  // Mudando a senha para hash
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(body.password, salt);

  body.password = hash;

  next();
};

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'tcc', (err, user) => {
      if (err) {
        return res.status(403).json('O token não é válido!');
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json('Não autenticado!');
  }
};

module.exports = {
  validateUser,
  authUser,
};
