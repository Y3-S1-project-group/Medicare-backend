/**
 * This file defines the routes for managing appointments using Express.js.
 * 
 * - It imports the necessary modules: 'express' for routing and 'Appointment' model for database operations.
 * - It creates an Express router instance to define various endpoints.
 * 
 * The following routes are defined:
 * 
 * 1. POST /add: Creates a new appointment.
 * 2. GET /: Retrieves all appointments.
 * 3. GET /get/:id: Retrieves a specific appointment by its ID.
 * 4. PUT /update/:id: Updates an existing appointment by its ID.
 * 5. DELETE /delete/:id: Deletes an appointment by its ID.
 * 
 * Each route handler performs the necessary database operations and sends appropriate HTTP responses.
 */

import express from 'express';
import Appointment from '../models/Appoinments.js'; // Adjust the path if necessary

const router = express.Router();

// Create a new appointment
router.post('/add', async (req, res) => {
  try {
    const { fullName, gender, email, doctor, date, time } = req.body;

    const newAppointment = new Appointment({
      fullName,
      gender,
      email,
      doctor,
      date,
      time
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an appointment by ID
router.get('/get/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an appointment
router.put('/update/:id', async (req, res) => {
  try {
    const { fullName, gender, email, doctor, date, time } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { fullName, gender, email, doctor, date, time },
      { new: true } // Return the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an appointment
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
