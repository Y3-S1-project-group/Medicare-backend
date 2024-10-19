/**
 * This file defines an Express router for handling HTTP requests related to appointments.
 * 
 * - It imports the Express library to create a router instance.
 * - It imports the Appointment model from the '../models/Appointments.js' file to interact with the appointments data.
 * - It creates a new router instance using `express.Router()`.
 * 
 * The router has one route defined:
 * 
 * - GET /appointments: This route retrieves all appointment records from the database.
 *   - It uses the `Appointment.find()` method to fetch all appointments.
 *   - If successful, it responds with a status code of 200 and the list of appointments in JSON format.
 *   - If an error occurs, it responds with a status code of 500 and the error message in JSON format.
 * 
 * Finally, the router is exported as the default export of the module.
 */

import express from 'express';
import Appointment from '../models/Appoinments.js'; 

const router = express.Router();


// Get all appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;