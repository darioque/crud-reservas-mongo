import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";

export const renderHome = (req, res) => {
  res.redirect('/reservations');
};

export const renderTables = async (req, res) => {
  try {
    const tables = await Table.find({ available: true });
    res.render('tables', { title: 'Available Tables', tables });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

export const renderRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

export const renderLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

export const renderReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user_id: req.user._id })
      .populate('table_id', 'table_number');
    res.render('reservations', { title: 'My Reservations', reservations });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

export const renderCreateReservation = async (req, res) => {
  try {
    const { table_id, date, time, party_size } = req.query;
    const tables = await Table.find({ available: true });
    res.render('create-reservation', { 
      title: 'Create Reservation', 
      tables,
      preselectedTable: table_id,
      date,
      time,
      party_size
    });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

export const renderEditReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, user_id: req.user._id }).populate('table_id');
    if (!reservation) {
      return res.status(404).render('error', { message: 'Reservation not found' });
    }
    const tables = await Table.find({ available: true });
    res.render('edit-reservation', { title: 'Edit Reservation', reservation, tables });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};