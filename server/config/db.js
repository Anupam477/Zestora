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
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zestora_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    await checkAndSeedData();
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning]: External MongoDB offline (${error.message}).`);
    console.log(`[MongoDB]: Initializing embedded database engine...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
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
