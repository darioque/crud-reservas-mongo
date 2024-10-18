import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";

export const renderHome = (req, res) => {
	res.redirect("/reservations");
};

export const renderTables = async (req, res) => {
	try {
		const tables = await Table.find({ available: true });
		res.render("tables", { title: "Available Tables", tables });
	} catch (error) {
		res.status(500).render("error", { message: error.message });
	}
};

export const renderRegister = (req, res) => {
	res.render("register", { title: "Register" });
};

export const renderLogin = (req, res) => {
	res.render("login", { title: "Login" });
};

export const renderDashboard = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).render("error", { message: "Access denied" });
      }
  
      // Fetch initial data for the dashboard
      const totalTables = await Table.countDocuments();
      const availableTables = await Table.countDocuments({ available: true });
  
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      const todayReservations = await Reservation.countDocuments({
        date: {
          $gte: today,
          $lt: tomorrow
        }
      });
  
      const totalReservations = await Reservation.countDocuments();
  
      // Fetch all tables for the table management section
      const tables = await Table.find().sort({ table_number: 1 });
  
      // Fetch recent reservations
      const recentReservations = await Reservation.find()
        .populate('user_id', 'name email')
        .populate('table_id', 'table_number capacity')
        .sort({ date: -1 })
        .limit(10);
  
      // Calculate initial occupancy data for the last 7 days
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      
      const weeklyReservations = await Reservation.find({
        date: {
          $gte: lastWeekStart,
          $lt: tomorrow
        }
      }).populate('table_id');
  
      const occupancyData = {};
      for (let d = new Date(lastWeekStart); d < tomorrow; d.setDate(d.getDate() + 1)) {
        occupancyData[d.toISOString().split('T')[0]] = {
          totalReservations: 0,
          totalGuests: 0,
          occupancyRate: 0
        };
      }
  
      weeklyReservations.forEach(reservation => {
        const dateKey = reservation.date.toISOString().split('T')[0];
        if (occupancyData[dateKey]) {
          occupancyData[dateKey].totalReservations++;
          occupancyData[dateKey].totalGuests += reservation.guests;
          occupancyData[dateKey].occupancyRate = 
            (occupancyData[dateKey].totalReservations / totalTables) * 100;
        }
      });
  
      res.render("dashboard", {
        title: "Admin Dashboard",
        stats: {
          totalTables,
          availableTables,
          todayReservations,
          totalReservations
        },
        tables,
        recentReservations,
        occupancyData,
        user: req.user
      });
    } catch (error) {
      console.error('Dashboard render error:', error);
      res.status(500).render("error", { 
        message: "Error loading dashboard", 
        error: process.env.NODE_ENV === 'development' ? error : {} 
      });
    }
  };

export const renderReservations = async (req, res) => {
	try {
		const reservations = await Reservation.find({
			user_id: req.user._id,
		}).populate("table_id", "table_number");
		res.render("reservations", { title: "My Reservations", reservations });
	} catch (error) {
		res.status(500).render("error", { message: error.message });
	}
};

export const renderCreateReservation = async (req, res) => {
	try {
		const { table_id, date, time, party_size } = req.query;
		const tables = await Table.find({ available: true });
		res.render("create-reservation", {
			title: "Create Reservation",
			tables,
			preselectedTable: table_id,
			date,
			time,
			party_size,
		});
	} catch (error) {
		res.status(500).render("error", { message: error.message });
	}
};

export const renderEditReservation = async (req, res) => {
	try {
		const reservation = await Reservation.findOne({
			_id: req.params.id,
			user_id: req.user._id,
		}).populate("table_id");
		if (!reservation) {
			return res
				.status(404)
				.render("error", { message: "Reservation not found" });
		}
		const tables = await Table.find({ available: true });
		res.render("edit-reservation", {
			title: "Edit Reservation",
			reservation,
			tables,
		});
	} catch (error) {
		res.status(500).render("error", { message: error.message });
	}
};
