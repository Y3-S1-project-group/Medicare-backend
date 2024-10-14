/**
 * This module defines a Mongoose schema and model for a Patient entity.
 * 
 * The Patient schema includes the following fields:
 * - firstname: A required string representing the patient's first name.
 * - lastname: A required string representing the patient's last name.
 * - age: A required number representing the patient's age, which must be a positive number.
 * - sex: A required string representing the patient's sex.
 * - address: A required string representing the patient's address.
 * - contactNumber: A required string representing the patient's contact number, which must be a 10-digit number.
 * - email: A required string representing the patient's email, which must be unique and follow a basic email format.
 * - password: A required string representing the patient's password.
 * - closestPerson: An embedded document representing the details of the patient's closest person, which includes:
 *   - firstname: A required string representing the closest person's first name.
 *   - lastname: A required string representing the closest person's last name.
 *   - address: A required string representing the closest person's address.
 *   - contactNumber: A required string representing the closest person's contact number, which must be a 10-digit number.
 * 
 * The schema also includes:
 * - Timestamps: Automatically adds `createdAt` and `updatedAt` fields to the document.
 * - A method `isValidPassword` to compare a given password with the stored hashed password using bcrypt.
 * 
 * The Patient model is then created from the schema and exported for use in other parts of the application.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Schema for closest person details
const closestPersonSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Example: validate for 10 digits
            },
            message: props => `${props.value} is not a valid contact number!`
        }
    },
});

// Schema for Patient
const patientSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    age: { 
        type: Number, 
        required: true, 
        min: [0, 'Age must be a positive number.'] 
    },
    sex: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Example: validate for 10 digits
            },
            message: props => `${props.value} is not a valid contact number!`
        }
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v); // Basic email format validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: { type: String, required: true },
    closestPerson: closestPersonSchema,
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Add a method to compare passwords
patientSchema.methods.isValidPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
