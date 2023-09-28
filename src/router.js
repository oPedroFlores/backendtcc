const express = require('express');
// User
const userController = require('./controllers/userController');
const userMiddleware = require('./middlewares/userMiddleware');
// Workers
const workersController = require('./controllers/workersController');
const workersMiddleware = require('./middlewares/workersMiddleware');
// Services
const servicesController = require('./controllers/servicesController');
// Calendar
const calendarController = require('./controllers/calendarController');


const router = express.Router();

// Users!
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

// Workers!
router.post(
  '/workers',
  userMiddleware.authUser,
  workersMiddleware.auth,
  workersController.createWorker,
);
router.get(
  '/workers',
  userMiddleware.authUser,
  workersMiddleware.auth,
  workersController.getWorkers,
);
router.delete(
  '/workers',
  userMiddleware.authUser,
  workersMiddleware.auth,
  workersController.deleteWorker,
);
router.put(
  '/workers',
  userMiddleware.authUser,
  workersMiddleware.auth,
  workersController.updateWorker,
);
router.post(
  '/workerservices',
  userMiddleware.authUser,
  workersMiddleware.auth,
  workersController.workerServices,
);

// Services
router.post(
  '/services',
  userMiddleware.authUser,
  workersMiddleware.auth,
  servicesController.createService,
);
router.get(
  '/services',
  userMiddleware.authUser,
  workersMiddleware.auth,
  servicesController.getServices,
);
router.delete(
  '/services',
  userMiddleware.authUser,
  workersMiddleware.auth,
  servicesController.deleteService,
);

router.put(
  '/services',
  userMiddleware.authUser,
  workersMiddleware.auth,
  servicesController.updateService,
);

// Calendar
router.get(
  '/calendar',
  userMiddleware.authUser,
  workersMiddleware.auth,
  calendarController.getCalendar,
)

module.exports = router;
