import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../server.js';
import Patient from '../models/patientModel.js';

const testPatient = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: new Date("1990-01-01"),
    gender: "Male",
    age: 34,
    address: "123 Main St",
    contactNumber: "1234567890",
    email: "johndoe@example.com",
    password: "password123",
    closestPerson: {
        firstName: "Jane",
        lastName: "Doe",
        address: "456 Side St",
        contactNumber: "0987654321"
    }
};

beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.TEST_MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Disconnect from the database after tests
    await mongoose.disconnect();
});

describe('Patient Routes', () => {
    // Positive test cases

    test('POST /signup - should register a new patient', async () => {
        const response = await request(app)
            .post('/signup')
            .send(testPatient);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.message).toBe('Patient registered successfully');
    });

    test('POST /login - should log in the patient', async () => {
        // Create the patient first
        await request(app)
            .post('/signup')
            .send(testPatient);

        const response = await request(app)
            .post('/login')
            .send({
                email: testPatient.email,
                password: testPatient.password,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.patient.email).toBe(testPatient.email);
    });

    test('POST /forgot-password - should send OTP for valid email', async () => {
        await request(app)
            .post('/signup')
            .send(testPatient);

        const response = await request(app)
            .post('/forgot-password')
            .send({ email: testPatient.email });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('OTP sent successfully');
        expect(response.body).toHaveProperty('hash');
    });

    // Negative test cases

    test('POST /signup - should return error if patient already exists', async () => {
        await request(app)
            .post('/signup')
            .send(testPatient);

        const response = await request(app)
            .post('/signup')
            .send(testPatient);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Patient already exists');
    });

    test('POST /login - should return error for invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: testPatient.email,
                password: 'wrongpassword', // Invalid password
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
    });

    test('POST /forgot-password - should return error for non-existent email', async () => {
        const response = await request(app)
            .post('/forgot-password')
            .send({ email: 'nonexistent@example.com' }); // Non-existent email

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Email not found');
    });
});
