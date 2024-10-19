/**
 * This file sets up routing for admin-related operations using Express.js.
 * 
 * 1. Imports the Express.js library and the adminController module.
 * 2. Creates a new Express router instance.
 * 3. Defines a POST route at '/admin/create' that triggers the createStaff method 
 *    in the adminController. This route is intended for creating new staff members 
 *    (e.g., doctors or nurses) and is restricted to admin users.
 * 4. Exports the router instance for use in other parts of the application.
 */

import express from 'express';
import adminController from '../controllers/adminController';

const router = express.Router();

// Route to create a new doctor or nurse (admin only)
router.post('/admin/create', adminController.createStaff);

export default router;
