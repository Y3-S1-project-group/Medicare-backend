import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import AppoinmentRouter from './routes/AppoinmentRouter.js';
import staffRouter from "./routes/Staffs.js";
import ReportRouter from "./routes/reportRouter.js";
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/staff", staffRouter);
app.use('/Appointment', AppoinmentRouter);
app.use('/report', ReportRouter);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});
