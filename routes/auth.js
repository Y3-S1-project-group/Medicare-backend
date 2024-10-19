/**
 * This file defines the authentication and user management routes for the application.
 * It uses Express.js for routing, bcryptjs for password hashing, jsonwebtoken for JWT token generation,
 * and express-validator for input validation. The routes include:
 * - User login
 * - Admin creation of Doctor/Nurse accounts
 * - Fetching user profile
 * - Updating user profile
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// JWT Secret
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//     throw new Error('JWT_SECRET is not defined in the environment variables');
// }

/**
 * Login Route
 * This route handles user login. It validates the email and password, checks the credentials against the database,
 * and returns a JWT token if the login is successful.
 */
router.post('/login', [
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login attempt failed: User not found for email ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login attempt failed: Incorrect password for email ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        console.log(`User logged in successfully: ${email} (${user.role})`);
        res.json({ token, role: user.role });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Admin - Create Doctor/Nurse
 * This route allows an admin to create new Doctor or Nurse accounts. It validates the input fields,
 * hashes the password, and saves the new user to the database.
 */
router.post('/admin/create', [
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('role').isIn(['Doctor', 'Nurse']).withMessage('Role must be either Doctor or Nurse')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, hospital, dob, address, contactNumber, email, password, role } = req.body;

    // Check admin credentials (you may want to implement this more securely)
    if (req.body.email !== 'admin@medicare.com' || req.body.password !== 'admin@123') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            firstName,
            lastName,
            hospital,
            dob,
            address,
            contactNumber,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: `${role} created successfully!` });
    } catch (error) {
        console.error('Server error during admin creation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Fetch user profile
 * This route fetches the profile of the currently authenticated user, excluding the password field.
 */
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Server error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Update user profile
 * This route updates the profile of the currently authenticated user with the provided data.
 */
router.put('/profile', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error('Server error updating user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;