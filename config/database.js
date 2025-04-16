// db.js
import mongoose from 'mongoose';

class Database {
  constructor() {
    this.connection = null;
  }

  connect() {
    if (!this.connection) {
      mongoose.connect(process.env.MONGODB_URI, {
      })
      .then((conn) => {
        console.log('MongoDB connected');
        this.connection = conn;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
      });
    }
    return this.connection;
  }

  getInstance() {
    return this.connection || this.connect();
  }
}

export default new Database();
