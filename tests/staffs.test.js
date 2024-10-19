import request from 'supertest';
import express from 'express';
import staffRouter from '../routes/Staffs';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();
app.use(express.json());
app.use('/api/staff', staffRouter);

// Increase timeout for the entire test suite
jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Connected to in-memory MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('Disconnected from in-memory MongoDB');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

describe('Staff API', () => {
  const validStaffMember = {
    ID: "ST001",
    FirstName: "John",
    LastName: "Doe",
    Gender: "Male",
    Role: "Doctor",
    PhoneNumber: "1234567890",
    Address: "123 Main Street, City",
    DOB: "1990-01-01",
    NIC: "901234567V",
    Email: "john.doe@example.com",
    Password: "password123"
  };

  describe('POST /api/staff/addStaff', () => {
    it('should create a new staff member with valid data', async () => {
      const response = await request(app)
        .post('/api/staff/addStaff')
        .send(validStaffMember);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        FirstName: validStaffMember.FirstName,
        LastName: validStaffMember.LastName,
        Role: validStaffMember.Role
      });
    }, 15000);

    it('should not create staff with invalid role', async () => {
      const invalidRole = {
        ...validStaffMember,
        Role: 'InvalidRole'
      };

      const response = await request(app)
        .post('/api/staff/addStaff')
        .send(invalidRole);

      expect(response.status).toBe(500);
    }, 15000);

    it('should not create staff with invalid gender', async () => {
      const invalidGender = {
        ...validStaffMember,
        Gender: 'InvalidGender'
      };

      const response = await request(app)
        .post('/api/staff/addStaff')
        .send(invalidGender);

      expect(response.status).toBe(500);
    }, 15000);

    it('should not create staff with short password', async () => {
      const shortPassword = {
        ...validStaffMember,
        Password: '123'
      };

      const response = await request(app)
        .post('/api/staff/addStaff')
        .send(shortPassword);

      expect(response.status).toBe(500);
    }, 15000);

    it('should not create staff with invalid phone number length', async () => {
      const invalidPhone = {
        ...validStaffMember,
        PhoneNumber: '123'
      };

      const response = await request(app)
        .post('/api/staff/addStaff')
        .send(invalidPhone);

      expect(response.status).toBe(500);
    }, 15000);

    it('should not create staff with invalid name length', async () => {
      const invalidName = {
        ...validStaffMember,
        FirstName: 'A' // Too short
      };

      const response = await request(app)
        .post('/api/staff/addStaff')
        .send(invalidName);

      expect(response.status).toBe(500);
    }, 15000);
  });

  describe('GET /api/staff/getAllStaff', () => {
    beforeEach(async () => {
      // Add test staff members
      await request(app)
        .post('/api/staff/addStaff')
        .send(validStaffMember);

      await request(app)
        .post('/api/staff/addStaff')
        .send({
          ...validStaffMember,
          ID: "ST002",
          FirstName: "Jane",
          Email: "jane.doe@example.com",
          NIC: "891234567V"
        });
    });

    it('should retrieve all staff members', async () => {
      const response = await request(app)
        .get('/api/staff/getAllStaff');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    }, 15000);
  });

  describe('GET /api/staff/getStaff/:id', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/staff/addStaff')
        .send(validStaffMember);
    });

    it('should retrieve a staff member by ID', async () => {
      const response = await request(app)
        .get(`/api/staff/getStaff/${validStaffMember.ID}`);

      expect(response.status).toBe(200);
      expect(response.body.FirstName).toBe(validStaffMember.FirstName);
      expect(response.body.Email).toBe(validStaffMember.Email);
    }, 15000);

    it('should return 404 for non-existent staff ID', async () => {
      const response = await request(app)
        .get('/api/staff/getStaff/NONEXISTENT');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Staff member not found');
    }, 15000);
  });

  describe('PUT /api/staff/updateStaff/:id', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/staff/addStaff')
        .send(validStaffMember);
    });

    it('should update an existing staff member with valid data', async () => {
      const updatedData = {
        FirstName: 'John Updated',
        Email: 'john.updated@example.com',
        PhoneNumber: '9876543210'
      };

      const response = await request(app)
        .put(`/api/staff/updateStaff/${validStaffMember.ID}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.FirstName).toBe(updatedData.FirstName);
      expect(response.body.Email).toBe(updatedData.Email);
    }, 15000);

    it('should not update with invalid role', async () => {
      const response = await request(app)
        .put(`/api/staff/updateStaff/${validStaffMember.ID}`)
        .send({ Role: 'InvalidRole' });

      expect(response.status).toBe(500);
    }, 15000);

    it('should not update with invalid phone number', async () => {
      const response = await request(app)
        .put(`/api/staff/updateStaff/${validStaffMember.ID}`)
        .send({ PhoneNumber: '123' });

      expect(response.status).toBe(500);
    }, 15000);
  });

  describe('DELETE /api/staff/deleteStaff/:id', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/staff/addStaff')
        .send(validStaffMember);
    });

    it('should delete an existing staff member', async () => {
      const response = await request(app)
        .delete(`/api/staff/deleteStaff/${validStaffMember.ID}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Staff member deleted successfully');

      // Verify staff member is deleted
      const getResponse = await request(app)
        .get(`/api/staff/getStaff/${validStaffMember.ID}`);
      expect(getResponse.status).toBe(404);
    }, 15000);
  });

  describe('GET /api/staff/searchStaffByRole', () => {
    beforeEach(async () => {
      // Add staff members with different roles
      await request(app)
        .post('/api/staff/addStaff')
        .send(validStaffMember); // Doctor

      await request(app)
        .post('/api/staff/addStaff')
        .send({
          ...validStaffMember,
          ID: "ST002",
          Role: "Nurse",
          Email: "nurse@example.com",
          NIC: "891234567V"
        });
    });

    it('should find staff members by valid role', async () => {
      const response = await request(app)
        .get('/api/staff/searchStaffByRole')
        .query({ role: 'Doctor' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].Role).toBe('Doctor');
    }, 15000);

    it('should handle search with no results', async () => {
      const response = await request(app)
        .get('/api/staff/searchStaffByRole')
        .query({ role: 'Technician' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No staff members found with the given role.');
    }, 15000);
  });
});