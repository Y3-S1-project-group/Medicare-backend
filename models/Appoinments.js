/**
 * This file defines a Mongoose schema and model for storing appointment data in a MongoDB database.
 * 
 * The schema, `appointmentSchema`, includes the following fields:
 * - `fullName`: A required string representing the full name of the person making the appointment. It is trimmed to remove any leading or trailing whitespace.
 * - `gender`: A required string that must be one of 'Male', 'Female', or 'Other'.
 * - `email`: A required string representing the email address of the person making the appointment.
 * - `doctor`: A required string representing the doctor's name or ID.
 * - `date`: A required date representing the appointment date.
 * - `time`: A required string representing the appointment time in HH:mm format.
 * - `createdAt`: A date representing when the appointment was created, with a default value of the current date and time.
 * 
 * The schema is then used to create a Mongoose model named `Appointment`, which is exported for use in other parts of the application.
 */

import mongoose from 'mongoose';

// Define the schema for the appointment
const appointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  doctor: {
    type: String,  // Doctor's name or ID
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,  // Time in HH:mm format
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model for appointments
const Appointment = mongoose.model('Appoint', appointmentSchema);

export default Appointment;
