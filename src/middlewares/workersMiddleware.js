const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Verificando se é admin ou cliente
  const role = req.user.role;
  if (role < 1) return res.status(403).json({ message: 'Sem autorização!' });
  else next();
};

module.exports = {
  auth,
};
