import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from './config/database.js'; // MongoDB Singleton

import AppoinmentRouter from './routes/AppoinmentRouter.js';
import staffRouter from "./routes/Staffs.js";
import ReportRouter from "./routes/reportRouter.js";
import authRoutes from './routes/auth.js';
// import adminRoutes from './routes/adminRoutes.js';

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
app.use("/api/staff", staffRouter);
app.use('/Appoint', AppoinmentRouter);
app.use('/report', ReportRouter);
app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});
