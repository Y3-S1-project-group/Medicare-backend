/**
 * This file defines an Express router for handling HTTP requests related to appointments.
 * 
 * - It imports the Express library to create a router instance.
 * - It imports the Report model from the '../models/report.js' file to interact with the appointment data.
 * - It creates a new router instance using `express.Router()`.
 * 
 * The router has two routes defined:
 * 
 * - GET /appointments: This route retrieves all appointment records from the database.
 *   - It uses the `Report.find()` method to fetch all appointments.
 *   - If successful, it responds with a status code of 200 and the list of appointments in JSON format.
 *   - If an error occurs, it responds with a status code of 500 and the error message in JSON format.
 *
 * - POST /appointments: This route creates a new appointment record in the database.
 *   - It uses the `Report.create()` method to add a new appointment.
 *   - If successful, it responds with a status code of 201 and a success message.
 *   - If an error occurs, it responds with a status code of 500 and the error message in JSON format.
 * 
 * Finally, the router is exported as the default export of the module.
 */

import express from 'express';
import Report from '../models/report.js'; // Ensure this path is correct

const router = express.Router();

// Create a new appointment
router.post('/appointments', async (req, res) => {
    const { fullName, gender, email, doctor, date, time } = req.body;

    // Validate required fields
    if (!fullName || !gender || !email || !doctor || !date || !time) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newAppointment = new Report({ // Use the correct model name
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
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Report.find(); // Use the correct model name
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
