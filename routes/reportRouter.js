import express from 'express';
import Appointment from '../models/Appoinments.js'; 

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;