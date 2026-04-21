const mongoose = require("mongoose");

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (cachedConnection || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).then((mongooseInstance) => {
      cachedConnection = mongooseInstance.connection;
      console.log("MongoDB connected");
      return cachedConnection;
    });
  }

  return connectionPromise;
};

module.exports = connectDB;
