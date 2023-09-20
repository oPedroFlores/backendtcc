const express = require('express');
const userController = require('./controllers/userController');
const userMiddleware = require('./middlewares/userMiddleware');

const router = express.Router();

router.post('/user', userMiddleware.authUser, userController.getUser);
router.get('/users', userMiddleware.authUser, userController.getAll);
router.post('/users', userMiddleware.validateUser, userController.createUser);
router.get('/login', userController.login);
router.delete(
  '/deleteUser',
  userMiddleware.authUser,
  userController.deleteUser,
);
router.post('/authenticate', userController.authenticate);

module.exports = router;
