/**
 * This file defines a Mongoose schema and model for a User in a MongoDB database.
 * 
 * The schema includes the following fields:
 * - firstName: A required string, trimmed of whitespace.
 * - lastName: A required string, trimmed of whitespace.
 * - hospital: An optional string, defaults to null.
 * - dob: A required date representing the user's date of birth.
 * - address: A required string for the user's address.
 * - contactNumber: A required string validated to be exactly 10 digits.
 * - email: A required, unique, lowercase string validated to be in a basic email format.
 * - password: A required string that will be hashed before saving.
 * - role: A string that can be one of 'Admin', 'Doctor', 'Nurse', or 'Patient', defaulting to 'Patient'.
 * 
 * The schema also includes:
 * - Timestamps: Automatically adds `createdAt` and `updatedAt` fields.
 * 
 * Additionally, the schema defines:
 * - A pre-save hook to hash the password if it has been modified.
 * - A method to compare a given password with the hashed password stored in the database.
 * 
 * The schema is then used to create a Mongoose model named 'User', which is exported for use in other parts of the application.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User Schema
const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true
    },
    hospital: { 
        type: String, 
        default: null
    },
    dob: { 
        type: Date, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
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
        unique: true, 
        required: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v); // Basic email format validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Doctor', 'Nurse', 'Patient'], 
        default: 'Patient' 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Method to hash passwords before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
