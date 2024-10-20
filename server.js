import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from './config/database.js'; // MongoDB Singleton

import patientRoutes from "./routes/patientRoutes.js";
import AppoinmentRouter from './routes/AppoinmentRouter.js';
import staffRouter from "./routes/Staffs.js";
import ReportRouter from "./routes/reportRouter.js";

dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the database connection using the Singleton pattern
db.getInstance();

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/staff", staffRouter);
app.use('/Appoint', AppoinmentRouter);
app.use('/report', ReportRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});
