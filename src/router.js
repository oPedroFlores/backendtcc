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
// Schedule
const scheduleController = require('./controllers/scheduleController');

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
router.get(
  '/workers/info',
  userMiddleware.authUser,
  workersMiddleware.auth,
  workersController.workersInfo,
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

router.get(
  '/services/info',
  userMiddleware.authUser,
  workersMiddleware.auth,
  servicesController.servicesInfo,
);

// Calendar
router.get(
  '/calendar',
  userMiddleware.authUser,
  workersMiddleware.auth,
  calendarController.getCalendar,
);

router.post(
  '/calendar',
  userMiddleware.authUser,
  workersMiddleware.auth,
  calendarController.postCalendar,
);

// Schedule
router.post('/schedule/workers', scheduleController.getWorkers);

router.post('/schedule/services', scheduleController.getServices);

router.post(
  '/schedule/get/schedules',
  scheduleController.getSchedulesByUsername,
);

router.post(
  '/schedule/set/schedule',
  userMiddleware.authUser,
  scheduleController.setSchedules,
);

router.post(
  '/schedule/info',
  userMiddleware.authUser,
  workersMiddleware.auth,
  scheduleController.infoSchedule,
);

router.get(
  '/schedule/user',
  userMiddleware.authUser,
  scheduleController.scheduleUser,
);

router.delete(
  '/schedule/delete',
  userMiddleware.authUser,
  scheduleController.scheduleDelete,
);

module.exports = router;
