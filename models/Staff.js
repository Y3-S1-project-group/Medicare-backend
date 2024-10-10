
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