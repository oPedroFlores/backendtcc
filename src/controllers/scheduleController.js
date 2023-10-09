const workersModel = require('../models/workersModel');
const servicesModel = require('../models/servicesModel');
const scheduleModel = require('../models/scheduleModel');

const getWorkers = async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) {
      return res.status(403).json({ message: 'Preencha os campos!' });
    }
    let workers = await workersModel.getWorkersByUsername(username);
    for (const worker of workers) {
      const [services] = await workersModel.getWorkerServices(worker.id);

      worker.services = services; // Adiciona a chave "services" ao funcionário
    }

    return res.status(200).json(workers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar os trabalhadores' });
  }
};

const getServices = async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) {
      return res.status(403).json({ message: 'Preencha os campos!' });
    }
    const services = await servicesModel.getServicesByUsername(username);

    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar os serviços' });
  }
};

const getSchedulesByUsername = async (req, res) => {
  try {
    const username = req.body.username;
    const date = req.body.date;
    if (!username || !date) {
      return res.status(403).json({ message: 'Preencha os campos!' });
    }
    const schedules = await scheduleModel.getSchedulesByUsername(
      username,
      date,
    );
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(403).json('Erro!');
  }
};

const setSchedules = async (req, res) => {
  const userId = req.user.id;
  const clientUsername = req.body.username;
  const serviceId = req.body.serviceId;
  const workerId = req.body.workerId;
  const startTimeStamp = req.body.startTimeStamp;
  const endTimeStamp = req.body.endTimeStamp;
  if (
    !userId ||
    !clientUsername ||
    !serviceId ||
    !workerId ||
    !startTimeStamp ||
    !endTimeStamp
  ) {
    return res.status(403).json({ message: 'Preencha os campos!' });
  }
  const response = await scheduleModel.setSchedule(
    userId,
    clientUsername,
    serviceId,
    workerId,
    startTimeStamp,
    endTimeStamp,
  );
  return res.status(201).json(response);
};

const infoSchedule = async (req, res) => {
  const worker = req.body.worker;
  const timestamp = req.body.timestamp;
  const user = req.user.id;

  if (!worker || !timestamp || !user) {
    return res.status(403).json({ message: 'Preencha todos os campos!' });
  }

  const schedule = await scheduleModel.getSchedule(timestamp, worker);

  if (schedule.length === 0) {
    return res.status(500).json(schedule);
  }

  return res.status(200).json(schedule);
};

module.exports = {
  getWorkers,
  getServices,
  getSchedulesByUsername,
  setSchedules,
  infoSchedule,
};
