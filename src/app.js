import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import userApiRoutes from "./routes/api/user.routes.js";
import reservationApiRoutes from "./routes/api/reservation.routes.js";
import tableApiRoutes from "./routes/api/table.routes.js";
import viewRoutes from "./routes/view.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up Pug as the view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// API Routes
app.use("/api/users", userApiRoutes);
app.use("/api/reservations", reservationApiRoutes);
app.use("/api/tables", tableApiRoutes);

// View Routes
app.use("/", viewRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

export default app;