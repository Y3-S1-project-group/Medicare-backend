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
const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
