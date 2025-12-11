import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gym_fitness";

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();
