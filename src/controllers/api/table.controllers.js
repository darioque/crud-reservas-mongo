import Table from "../../models/Table.js";

export const createTable = async (req, res) => {
	try {
		const { table_number, capacity } = req.body;
		const table = new Table({ table_number, capacity });
		await table.save();
		res.status(201).json(table);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getAllTables = async (req, res) => {
	try {
		const tables = await Table.find();
		res.json(tables);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getTable = async (req, res) => {
	try {
		const table = await Table.findById(req.params.id);
		if (!table) {
			return res.status(404).json({ message: "Table not found" });
		}
		res.json(table);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateTable = async (req, res) => {
	try {
		const { table_number, capacity, available } = req.body;
		const table = await Table.findByIdAndUpdate(
			req.params.id,
			{ table_number, capacity, available },
			{ new: true, runValidators: true }
		);
		if (!table) {
			return res.status(404).json({ message: "Table not found" });
		}
		res.json(table);
	} catch (error) {
        res.status(500).json({ message: error.message });
	}
};

export const deleteTable = async (req, res) => {
	try {
		const table = await Table.findById(req.params.id);
		if (!table) {
			return res.status(404).json({ message: "Table not found" });
		}

		if (table.reservations.length > 0) {
			return res.status(400).json({
				message: "Cannot delete table with existing reservations",
			});
		}

		await table.remove();
        res.json({ message: "Table deleted successfully" });
	} catch (error) {
        res.status(500).json({ message: error.message });
	}
};

export const getAvailableTables = async (req, res) => {
	try {
		const { date, time, party_size } = req.query;

		const availableTables = await Table.find({
			available: true,
			capacity: { $gte: parseInt(party_size) },
		}).populate("reservations");

		const filteredTables = availableTables.filter(
			(table) =>
				!table.reservations.some(
					(reservation) =>
						reservation.date.toDateString() ===
							new Date(date).toDateString() &&
						reservation.time === time
				)
		);

        res.json(filteredTables);
	} catch (error) {
        res.status(500).json({ message: error.message });
	}
};
