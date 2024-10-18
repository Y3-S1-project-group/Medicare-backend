//server.js
import AppoinmentRouter from './routes/AppoinmentRouter.js'; 
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
dotenv.config(); // Load environment variables

import staffRouter from "./routes/Staffs.js";

import ReportRouter from "./routes/reportRouter.js";



const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies with Unicode characters

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});

//Inventory routes
app.use("/api/staff", staffRouter);

//Report routes
app.use('/report', ReportRouter);

//Appoinments user profile 
app.use('/Appoint', AppoinmentRouter);

