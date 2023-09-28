const calendarModel = require('../models/calendarModel');

const getCalendar = async (req, res) => {
  const clientId = req.user.id;
  const response = await calendarModel.getCalendar(clientId);
  return res.status(201).json(response);
};

const postCalendar = async (req, res) => {
  const clientId = req.user.id;
  const calendar = req.body;
  // Vendo se já existe algo para este cliente no calendário
  const existedCalendar = await calendarModel.getCalendar(clientId);
  if (existedCalendar) {
    const deletedCalendar = await calendarModel.deleteCalendar(clientId);
  }

  // Criando calendário
  const createdCalendar = await calendarModel.createCalendar(
    clientId,
    calendar,
  );

  return res.json(createdCalendar);
};

module.exports = {
  getCalendar,
  postCalendar,
};
