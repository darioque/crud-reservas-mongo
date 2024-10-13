import { Router } from "express";
import {
	createUser,
	loginUser,
	logoutUser,
	userProfile,
} from "../../controllers/api/user.controllers.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", auth, userProfile);
router.post("/logout", logoutUser);

export default router;
