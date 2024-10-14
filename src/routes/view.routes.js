import { Router } from "express";
import {
  renderHome,
  renderTables,
  renderRegister,
  renderLogin,
  renderReservations,
  renderCreateReservation,
  renderEditReservation,
} from "../controllers/view.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', auth, renderHome);
router.get('/tables', auth, renderTables);
router.get('/register', renderRegister);
router.get('/login', renderLogin);
router.get('/reservations', auth, renderReservations);
router.get('/reservations/create', auth, renderCreateReservation);
router.get('/reservations/edit/:id', auth, renderEditReservation);

export default router;