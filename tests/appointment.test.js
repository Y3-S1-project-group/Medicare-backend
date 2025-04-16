// import request from 'supertest';
// import express from 'express';
// import appointmentRouter from '../routes/AppoinmentRouter';
// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';

// const app = express();
// app.use(express.json());
// app.use('/api/appointments', appointmentRouter);

// // Increase timeout for the entire test suite
// jest.setTimeout(60000);

// let mongoServer;

// beforeAll(async () => {
//   try {
//     mongoServer = await MongoMemoryServer.create();
//     const mongoUri = mongoServer.getUri();
//     await mongoose.connect(mongoUri, {
//      // useNewUrlParser: true,
//      // useUnifiedTopology: true,
//     });
//     console.log('Connected to in-memory MongoDB');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//   }
// });

// afterAll(async () => {
//   try {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//     console.log('Disconnected from in-memory MongoDB');
//   } catch (error) {
//     console.error('Cleanup error:', error);
//   }
// });

// // Clear all collections before each test
// beforeEach(async () => {
//   if (mongoose.connection.readyState === 1) { // If connected
//     const collections = await mongoose.connection.db.collections();
//     for (const collection of collections) {
//       await collection.deleteMany({});
//     }
//   }
// });

// describe('Appointment API', () => {
//   it('should create a new appointment', async () => {
//     const appointmentData = {
//       fullName: 'John Doe',
//       gender: 'Male',
//       email: 'john@example.com',
//       doctor: 'Dr. Smith',
//       date: '2024-10-20',
//       time: '10:00 AM',
//     };

//     const response = await request(app)
//       .post('/api/appointments/add')
//       .send(appointmentData);

//     expect(response.status).toBe(201);
//     expect(response.body.message).toBe('Appointment booked successfully');
//     expect(response.body.appointment).toMatchObject({
//       fullName: appointmentData.fullName,
//       email: appointmentData.email,
//     });
//   }, 15000);

//   it('should not create an appointment with missing required fields', async () => {
//     const response = await request(app)
//       .post('/api/appointments/add')
//       .send({
//         fullName: 'John Doe',
//         // Missing other required fields
//       });

//     expect(response.status).toBe(400);
//   }, 15000);
// });

// describe('GET /api/appointments', () => {
//   beforeEach(async () => {
//     // Add test appointments
//     await request(app)
//       .post('/api/appointments/add')
//       .send({
//         fullName: 'Test User 1',
//         gender: 'Male',
//         email: 'test1@example.com',
//         doctor: 'Dr. Smith',
//         date: '2024-10-20',
//         time: '10:00 AM',
//       });

//     await request(app)
//       .post('/api/appointments/add')
//       .send({
//         fullName: 'Test User 2',
//         gender: 'Female',
//         email: 'test2@example.com',
//         doctor: 'Dr. Jones',
//         date: '2024-10-21',
//         time: '11:00 AM',
//       });
//   });

//   it('should retrieve all appointments', async () => {
//     const response = await request(app).get('/api/appointments');
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBe(2);
//   }, 15000);
// });

// describe('GET /api/appointments/get/:id', () => {
//   let appointmentId;

//   beforeEach(async () => {
//     const response = await request(app)
//       .post('/api/appointments/add')
//       .send({
//         fullName: 'Jane Doe',
//         gender: 'Female',
//         email: 'jane@example.com',
//         doctor: 'Dr. Smith',
//         date: '2024-12-02',
//         time: '11:00 AM',
//       });
//     appointmentId = response.body.appointment._id;
//   });

//   it('should retrieve an appointment by ID', async () => {
//     const response = await request(app)
//       .get(`/api/appointments/get/${appointmentId}`);
    
//     expect(response.status).toBe(200);
//     expect(response.body.fullName).toBe('Jane Doe');
//     expect(response.body.email).toBe('jane@example.com');
//   }, 15000);

//   it('should return 404 for non-existent appointment ID', async () => {
//     const nonExistentId = new mongoose.Types.ObjectId();
//     const response = await request(app)
//       .get(`/api/appointments/get/${nonExistentId}`);
    
//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe('Appointment not found');
//   }, 15000);
// });

// describe('PUT /api/appointments/update/:id', () => {
//   let appointmentId;

//   beforeEach(async () => {
//     const response = await request(app)
//       .post('/api/appointments/add')
//       .send({
//         fullName: 'Mark Doe',
//         gender: 'Male',
//         email: 'mark@example.com',
//         doctor: 'Dr. Smith',
//         date: '2024-12-03',
//         time: '12:00 PM',
//       });
//     appointmentId = response.body.appointment._id;
//   });

//   it('should update an existing appointment', async () => {
//     const updatedData = {
//       fullName: 'Mark Updated',
//       email: 'markupdated@example.com',
//       time: '1:00 PM',
//     };

//     const response = await request(app)
//       .put(`/api/appointments/update/${appointmentId}`)
//       .send(updatedData);

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Appointment updated successfully');
//     expect(response.body.appointment.fullName).toBe(updatedData.fullName);
//     expect(response.body.appointment.email).toBe(updatedData.email);
//   }, 15000);

//   it('should return 404 for updating non-existent appointment', async () => {
//     const nonExistentId = new mongoose.Types.ObjectId();
//     const response = await request(app)
//       .put(`/api/appointments/update/${nonExistentId}`)
//       .send({ fullName: 'Updated Name' });

//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe('Appointment not found');
//   }, 15000);
// });

// describe('DELETE /api/appointments/delete/:id', () => {
//   let appointmentId;

//   beforeEach(async () => {
//     const response = await request(app)
//       .post('/api/appointments/add')
//       .send({
//         fullName: 'Delete Me',
//         gender: 'Female',
//         email: 'delete@example.com',
//         doctor: 'Dr. Smith',
//         date: '2024-12-04',
//         time: '2:00 PM',
//       });
//     appointmentId = response.body.appointment._id;
//   });

//   it('should delete an existing appointment', async () => {
//     const response = await request(app)
//       .delete(`/api/appointments/delete/${appointmentId}`);

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Appointment deleted successfully');

//     // Verify appointment is deleted
//     const getResponse = await request(app)
//       .get(`/api/appointments/get/${appointmentId}`);
//     expect(getResponse.status).toBe(404);
//   }, 15000);

//   it('should return 404 for deleting non-existent appointment', async () => {
//     const nonExistentId = new mongoose.Types.ObjectId();
//     const response = await request(app)
//       .delete(`/api/appointments/delete/${nonExistentId}`);

//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe('Appointment not found');
//   }, 15000);
// });