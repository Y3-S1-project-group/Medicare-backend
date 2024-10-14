import express from 'express';
import Appointment from '../models/UserAppoint.js'; // Adjust the path if necessary

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
