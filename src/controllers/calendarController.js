const calendarModel = require('../models/calendarModel');

const getCalendar = async (req, res) => {
    const clientId = req.user.id;
    const response = await calendarModel.getCalendar(clientId);
    return res.status(201).json(response);
  };

  
module.exports = {
    getCalendar,
  };
  