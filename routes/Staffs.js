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
/*router.route("/updateStaff/:id").put(async (req, res) => {
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
*/

router.route("/updateStaff/:id").put(async (req, res) => {
  try {
    // First, validate the update data against the schema
    const updateData = req.body;
    
    // If trying to update Role, validate it
    if (updateData.Role) {
      const validRoles = ["Doctor", "Nurse", "Technician", "Administrative staff"];
      if (!validRoles.includes(updateData.Role)) {
        return res.status(500).json({ 
          error: "Invalid Role. Must be one of: Doctor, Nurse, Technician, Administrative staff" 
        });
      }
    }

    // If trying to update Gender, validate it
    if (updateData.Gender) {
      const validGenders = ["Male", "Female", "Other"];
      if (!validGenders.includes(updateData.Gender)) {
        return res.status(500).json({ 
          error: "Invalid Gender. Must be one of: Male, Female, Other" 
        });
      }
    }

    // Validate phone number length if it's being updated
    if (updateData.PhoneNumber && (updateData.PhoneNumber.length < 10 || updateData.PhoneNumber.length > 15)) {
      return res.status(500).json({ 
        error: "Phone number must be between 10 and 15 characters" 
      });
    }

    // Validate name length if being updated
    if (updateData.FirstName && (updateData.FirstName.length < 2 || updateData.FirstName.length > 100)) {
      return res.status(500).json({ 
        error: "First name must be between 2 and 100 characters" 
      });
    }

    if (updateData.LastName && (updateData.LastName.length < 2 || updateData.LastName.length > 100)) {
      return res.status(500).json({ 
        error: "Last name must be between 2 and 100 characters" 
      });
    }

    // Validate password length if being updated
    if (updateData.Password && updateData.Password.length < 8) {
      return res.status(500).json({ 
        error: "Password must be at least 8 characters long" 
      });
    }

    // If all validations pass, perform the update
    const updatedStaff = await Staff.findOneAndUpdate(
      { ID: req.params.id },
      { $set: updateData },
      { 
        new: true,
        runValidators: true // This ensures mongoose schema validators run on update
      }
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