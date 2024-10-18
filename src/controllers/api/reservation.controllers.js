import Reservation from "../../models/Reservation.js";
import Table from "../../models/Table.js";

export const createReservation = async (req, res) => {
  try {
    const { table_id, date, time, guests } = req.body;
    const user_id = req.user._id;

    // Check if table is available and has enough capacity
    const table = await Table.findById(table_id);
    if (!table || !table.available || table.capacity < guests) {
      return res.status(400).json({
        message: "Table not available or insufficient capacity",
      });
    }

    // Check if table is already reserved for the given date
    const existingReservation = await Reservation.findOne({
      table_id,
      date: new Date(date),
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "Table is already reserved for this date",
      });
    }

    const reservation = new Reservation({
      user_id,
      table_id,
      date: new Date(date + " " + time),
      guests,
    });

    await reservation.save();

    table.reservations.push(reservation._id);
    await table.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user_id", "name email")
      .populate("table_id", "table_number capacity");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user_id: req.user._id,
    }).populate("table_id", "table_number capacity");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("table_id", "table_number capacity");
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { table_id, date, guests } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this reservation" });
    }

    // Check if new table is available if changed
    if (table_id && table_id !== reservation.table_id.toString()) {
      const newTable = await Table.findById(table_id);
      if (!newTable || !newTable.available || newTable.capacity < guests) {
        return res
          .status(400)
          .json({ message: "New table not available or insufficient capacity" });
      }

      // Remove reservation from old table
      await Table.findByIdAndUpdate(reservation.table_id, {
        $pull: { reservations: reservation._id },
      });

      // Add reservation to new table
      newTable.reservations.push(reservation._id);
      await newTable.save();
    }

    reservation.table_id = table_id || reservation.table_id;
    reservation.date = date || reservation.date;
    reservation.guests = guests || reservation.guests;

    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this reservation" });
    }

    // Remove reservation from table
    await Table.findByIdAndUpdate(reservation.table_id, {
      $pull: { reservations: reservation._id },
    });

    await reservation.deleteOne();
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
