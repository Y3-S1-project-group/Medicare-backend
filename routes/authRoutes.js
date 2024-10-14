/**
 * This file sets up the authentication routes for the application using Express.js.
 * 
 * - It imports the necessary modules: 'express' for creating the router and 
 *   'login' and 'signupPatient' functions from the 'authController.js' file.
 * - It creates an instance of an Express router.
 * - It defines two routes:
 *   1. POST '/login' - This route is used to log in a user (Patient, Doctor, Nurse, or Admin)
 *      and is handled by the 'login' function.
 *   2. POST '/signup/patient' - This route is used to sign up a new patient and is handled 
 *      by the 'signupPatient' function.
 * - Finally, it exports the router to be used in other parts of the application.
 */

import express from 'express';
import { login, signupPatient } from '../controllers/authController.js';

const router = express.Router();

// Route to log in a user (Patient, Doctor, Nurse, or Admin)
router.post('/login', login);

// Signup Route
router.post('/signup/patient', signupPatient);

export default router;
