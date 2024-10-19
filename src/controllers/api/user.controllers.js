import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../../libs/jwt.js";

export const createUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		const userfound = await User.findOne({ email });

		if (userfound)
			return res.status(400).json({ message: "User already exists" });

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = new User({ name, email, password: hashedPassword, role });

		// Save user
		const savedUser = await user.save();

		//Create the access token
		const token = await createAccessToken({
			_id: savedUser._id,
			role: savedUser.role,
		});

		// Set cookie
		res.cookie("token", token);

		// Send response
		res.json({
			id: savedUser._id,
			username: savedUser.name,
			email: savedUser.email,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const userFound = await User.findOne({ email });
		if (!userFound)
			return res.status(401).json({ message: "Invalid credentials" });

		// Check password
		const isMatch = await bcrypt.compare(password, userFound.password);

		if (!isMatch)
			return res.status(401).json({ message: "Invalid credentials" });

		//Create the access token
		const token = await createAccessToken({
			_id: userFound._id,
			role: userFound.role,
            name: userFound.name
		});

		// Set cookie
		res.cookie("token", token);

		return res.json({
			id: userFound._id,
			username: userFound.name,
			email: userFound.email,
            role: userFound.role
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const userProfile = async (req, res) => {
	try {
		// Buscar el usuario por su ID (el ID está en req.user, gracias al middleware auth)
		const user = await User.findById(req.user._id).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Enviar los datos del usuario como respuesta
		res.json({
			id: user._id,
			username: user.name,
			email: user.email,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const logoutUser = async (req, res) => {
	try {
		res.cookie("token", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
