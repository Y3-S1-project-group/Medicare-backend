/**
 * This module defines routes for managing staff members in an Express application.
 * It includes routes for creating, retrieving, updating, and deleting staff members,
 * as well as searching staff members by role.
 */

import express from "express";
import Staff from "../models/Staff.js";

const router = express.Router();

/**
 * Create a new staff member.
 * This route handles POST requests to "/addStaff" and saves a new staff member to the database.
 */
router.route("/addStaff").post(async (req, res) => {
  const { 
    ID, 
    FirstName, 
    LastName, 
    Gender, 
    Role, 
    PhoneNumber, 
    Address, 
    DOB, 
    NIC, 
    Email, 
    Password 
  } = req.body;

  const newStaff = new Staff({
    ID,
    FirstName,
    LastName,
    Gender,
    Role,
    PhoneNumber,
    Address,
    DOB,
    NIC,
    Email,
    Password
  });

  newStaff
    .save()
    .then(() => {
      res.status(200).json(newStaff);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

/**
 * Get all staff members.
 * This route handles GET requests to "/getAllStaff" and retrieves all staff members from the database.
 */
router.route("/getAllStaff").get(async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.status(200).json(staffMembers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a single staff member by ID.
 * This route handles GET requests to "/getStaff/:id" and retrieves a specific staff member by their ID.
 */
router.route("/getStaff/:id").get(async (req, res) => {
  try {
    const staffMember = await Staff.findOne({ ID: req.params.id });
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(staffMember);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update a staff member.
 * This route handles PUT requests to "/updateStaff/:id" and updates a specific staff member's details.
 */
router.route("/updateStaff/:id").put(async (req, res) => {
  try {
    const updatedStaff = await Staff.findOneAndUpdate(
      { ID: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(updatedStaff);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a staff member.
 * This route handles DELETE requests to "/deleteStaff/:id" and deletes a specific staff member from the database.
 */
router.route("/deleteStaff/:id").delete(async (req, res) => {
  try {
    const deletedStaff = await Staff.findOneAndDelete({ ID: req.params.id });
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Search staff members by role.
 * This route handles GET requests to "/searchStaffByRole" and retrieves staff members matching a specific role.
 */
router.get('/searchStaffByRole', async (req, res) => {
  const { role } = req.query; // Get the role from the query parameters

  try {
      // Use a case-insensitive regex search for the role
      const staffMembers = await Staff.find({
          Role: { $regex: role, $options: 'i' } // 'i' for case-insensitive matching
      });

      // If no staff members found
      if (staffMembers.length === 0) {
          return res.status(404).json({ message: "No staff members found with the given role." });
      }

      res.status(200).json(staffMembers); // Return the matching staff members
  } catch (error) {
      console.error("Error searching staff members:", error);
      res.status(500).json({ error: error.message }); // Handle errors
  }
});

export default router;