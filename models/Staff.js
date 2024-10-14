/**
 * This file defines a Mongoose schema for a "Staff" collection in a MongoDB database.
 * 
 * The schema includes the following fields:
 * - ID: A unique identifier for each staff member, required and trimmed.
 * - FirstName: The first name of the staff member, required, trimmed, and with a length between 2 and 100 characters.
 * - LastName: The last name of the staff member, required, trimmed, and with a length between 2 and 100 characters.
 * - Gender: The gender of the staff member, required and restricted to "Male", "Female", or "Other".
 * - Role: The role of the staff member, required and restricted to "Doctor", "Nurse", "Technician", or "Administrative staff".
 * - PhoneNumber: The phone number of the staff member, required, trimmed, and with a length between 10 and 15 characters.
 * - Address: The address of the staff member, required, trimmed, and with a length between 5 and 255 characters.
 * - DOB: The date of birth of the staff member, required.
 * - NIC: The national ID card number of the staff member, required, trimmed, and with a length between 10 and 12 characters.
 * - Email: The email address of the staff member, required and trimmed.
 * - Password: The password for the staff member's account, required, trimmed, and with a minimum length of 8 characters.
 * 
 * The schema also includes timestamps, which automatically add `createdAt` and `updatedAt` fields to the documents.
 * 
 * The schema is then exported as a Mongoose model named "Staff".
 */

import mongoose from "mongoose";
const StaffSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes leading or trailing whitespace
    },
    FirstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true, // Removes leading or trailing spaces
    },
    LastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true, // Removes leading or trailing spaces
    },
    Gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"], // Allowed gender options
    },
    Role: {
      type: String,
      required: true,
      enum: ["Doctor", "Nurse", "Technician", "Administrative staff"], // Define job roles
    },
    PhoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 15,
      trim: true, // To handle spaces in the number if inputted incorrectly
    },
    Address: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true, // Removes leading or trailing spaces
    },
    DOB: {
      type: Date,
      required: true,
    },
    NIC: {
      type: String,
      required: true,
      //unique: true, // National ID should be unique
      minlength: 10,
      maxlength: 12,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      //unique: true,
      /*match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ], // Regex for validating email format*/
      trim: true, // Removes leading or trailing spaces
    },
    Password: {
      type: String,
      required: true,
      minlength: 8, // Minimum password length requirement
      trim: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Export the model

export default mongoose.model("Staff", StaffSchema);