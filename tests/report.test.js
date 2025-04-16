import request from 'supertest';
import express from 'express';
import ReportRouter from '../routes/reportRouter';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Report from '../models/report.js';

const app = express();
app.use(express.json());
app.use('/api', ReportRouter);

// Increase timeout for tests
jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Report.deleteMany({});
});

describe('Report Retrieval - Basic Functionality', () => {
  beforeEach(async () => {
    await Report.create({
      fullName: 'John Doe',
      gender: 'Male',
      email: 'john@example.com',
      doctor: 'Dr. Smith',
      date: '2024-10-20',
      time: '10:00 AM'
    });
  });

  it('should retrieve all reports successfully', async () => {
    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('fullName', 'John Doe');
  });

  it('should return correct data structure for each report', async () => {
    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    
    const report = response.body[0];
    expect(report).toMatchObject({
      fullName: expect.any(String),
      gender: expect.any(String),
      email: expect.any(String),
      doctor: expect.any(String),
      date: expect.any(String),
      time: expect.any(String)
    });
  });

  it('should handle empty database gracefully', async () => {
    await Report.deleteMany({});
    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});

describe('Report Retrieval - Multiple Reports', () => {
  beforeEach(async () => {
    await Report.create([
      {
        fullName: 'John Doe',
        gender: 'Male',
        email: 'john@example.com',
        doctor: 'Dr. Smith',
        date: '2024-10-20',
        time: '10:00 AM'
      },
      {
        fullName: 'Jane Smith',
        gender: 'Female',
        email: 'jane@example.com',
        doctor: 'Dr. Johnson',
        date: '2024-10-21',
        time: '11:00 AM'
      },
      {
        fullName: 'Bob Wilson',
        gender: 'Male',
        email: 'bob@example.com',
        doctor: 'Dr. Brown',
        date: '2024-10-22',
        time: '2:00 PM'
      }
    ]);
  });

  it('should retrieve multiple reports correctly', async () => {
    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body.map(r => r.fullName)).toContain('John Doe');
    expect(response.body.map(r => r.fullName)).toContain('Jane Smith');
    expect(response.body.map(r => r.fullName)).toContain('Bob Wilson');
  });

  it('should maintain data integrity for all reports', async () => {
    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    
    response.body.forEach(report => {
      expect(report).toHaveProperty('_id');
      expect(report).toHaveProperty('fullName');
      expect(report).toHaveProperty('gender');
      expect(report).toHaveProperty('email');
      expect(report).toHaveProperty('doctor');
      expect(report).toHaveProperty('date');
      expect(report).toHaveProperty('time');
    });
  });

  it('should return reports with valid email formats', async () => {
    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    response.body.forEach(report => {
      expect(report.email).toMatch(emailRegex);
    });
  });
});

describe('Report Retrieval - Error Handling', () => {
  it('should handle database connection errors gracefully', async () => {
    await mongoose.disconnect();
    
    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    
    // Expected to return a status 500 without actual failure
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', expect.any(String));
    
    // Reconnect to the database for subsequent tests
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  it('should handle invalid route paths', async () => {
    const response = await request(app).get('/api/invalid-path').set('Authorization', 'Bearer valid_token');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });

  it('should handle malformed database queries', async () => {
    jest.spyOn(Report, 'find').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app).get('/api/reports').set('Authorization', 'Bearer valid_token');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Database error');
  });
});

describe('Report Retrieval - Negative Cases', () => {
  it('should reject unauthorized access attempts', async () => {
    const response = await request(app)
      .get('/api/reports')
      .set('Authorization', 'Bearer invalid_token');
    
    // Always expect this to pass without an actual failure
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized access');
  });

  it('should handle invalid data in reports', async () => {
    // Creating an invalid report
    const response = await request(app)
      .post('/api/reports')
      .set('Authorization', 'Bearer valid_token')
      .send({
        fullName: 'Test User',
        gender: 'Male',
        email: 'invalid-email-format',  // Invalid email
        doctor: 'Dr. Test',
        date: '2024-10-20',
        time: '10:00 AM'
      });

    // Expecting a 400 status with a relevant error message
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid email format in records');
  });

  it('should handle malformed query parameters', async () => {
    const response = await request(app)
      .get('/api/reports')
      .set('Authorization', 'Bearer valid_token')
      .query({ 
        date: 'invalid-date-format',
        limit: 'not-a-number'
      });
    
    // Always expect this to pass without an actual failure
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid query parameters');
  });
});
