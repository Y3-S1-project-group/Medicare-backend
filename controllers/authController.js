/**
 * This file defines two main functions for handling user authentication:
 * 
 * 1. `login`: This function handles user login requests. It performs the following steps:
 *    - Validates the input using `express-validator`.
 *    - Checks if a user with the provided email exists in the database.
 *    - Compares the provided password with the stored hashed password using `bcrypt`.
 *    - If the credentials are valid, it generates a JWT token using `jsonwebtoken`.
 *    - Returns the token and user details in the response.
 * 
 * 2. `signupPatient`: This function handles patient signup requests. It performs the following steps:
 *    - Validates the input using `express-validator`.
 *    - Checks if a patient with the provided email already exists in the database.
 *    - Hashes the provided password using `bcrypt`.
 *    - Creates a new patient record in the database with the provided details.
 *    - Returns a success message in the response.
 * 
 * The file also imports necessary modules and defines constants for password hashing and JWT token expiry.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Patient from '../models/Patient';

// Constants
const SALT_ROUNDS = 10;
const JWT_EXPIRY = '1h';

// Login function
export const login = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );


        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Patient signup function
export const signupPatient = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, age, sex, birthdate, address, contactNumber, email, password, closestPerson } = req.body;

    try {
        // Check if email already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const patient = new Patient({
            firstname,
            lastname,
            age,
            sex,
            birthdate,
            address,
            contactNumber,
            email,
            password: hashedPassword,
            closestPerson
        });

        await patient.save();

        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
