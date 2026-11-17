const mongoose = require('mongoose');

let mongodInstance = null;

const checkAndSeedData = async () => {
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB]: Database is empty. Auto-seeding initial Zestora data...');
      const { seedDatabase } = require('../seed/seedData');
      await seedDatabase(false);
    }
  } catch (err) {
    console.warn(`[MongoDB Seed Check]: ${err.message}`);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri && process.env.NODE_ENV === 'production') {
    console.log('[MongoDB]: No MONGO_URI provided in production. Using high-speed in-memory store for demo.');
    return null;
  }

  const connectUri = uri || 'mongodb://127.0.0.1:27017/zestora_db';
  try {
    const conn = await mongoose.connect(connectUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    await checkAndSeedData();
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning]: External MongoDB offline (${error.message}).`);
    if (process.env.NODE_ENV === 'production') {
      console.log('[MongoDB]: Using resilient fallback in-memory store.');
      return null;
    }
    console.log(`[MongoDB]: Initializing embedded database engine...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        binary: {
          version: '5.0.19',
        },
        instance: {
          dbName: 'zestora_db',
        },
      });
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB Connected (Embedded)]: ${memoryUri}`);
      await checkAndSeedData();
      return conn;
    } catch (memError) {
      console.error(`[MongoDB Error]: Failed to start embedded database: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
