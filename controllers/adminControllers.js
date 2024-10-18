
/**
 * This module defines a function to create a new staff member (either a doctor or a nurse).
 * 
 * The function `createStaff` performs the following steps:
 * 1. Validates the request body using `express-validator`.
 * 2. Checks if a user with the provided email already exists in the database.
 * 3. Hashes the provided password using `bcryptjs` with a specified number of salt rounds.
 * 4. Creates a new user with the provided details and the hashed password.
 * 5. Saves the new user to the database.
 * 6. Returns a success response if the user is created successfully, or an error response if there is a validation error, the email already exists, or a server error occurs.
 * 
 * Dependencies:
 * - `bcryptjs` for hashing passwords.
 * - `express-validator` for validating request data.
 * - `User` model for interacting with the user data in the database.
 * 
 * Constants:
 * - `SALT_ROUNDS`: Number of rounds to use when hashing the password.
 */

import bcrypt from 'bcryptjs';
import User from '../models/User';
import { validationResult } from 'express-validator';

// Constants
const SALT_ROUNDS = 10;

// Function to create a new staff member (doctor or nurse)
export const createStaff = async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, hospital, dob, address, contactNumber, email, password, role } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password using utility
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            hospital,
            dob,
            address,
            contactNumber,
            email,
            password: hashedPassword,
            role, // should be either 'doctor' or 'nurse'
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: `${role} account created successfully.` });

    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
