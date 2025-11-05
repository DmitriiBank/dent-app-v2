import dotenv from 'dotenv';
dotenv.config();
import { launchServer } from "./server.js";
import mongoose from "mongoose";
import { db } from "./config/quizConfig.js";
import './validators/testResult.schema.js';
process.on('uncaughtException', (err) => {
    console.error('💣 UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
console.log('🚧 Starting server initialization...');
await mongoose.connect(db)
    .then(() => {
    console.log('🟢 Database connected successfully');
    launchServer();
})
    .catch(err => console.error('MongoDB connection error:', err));
const shutdown = (signal) => {
    console.log(`👋 ${signal} received. Shutting down gracefully...`);
};
process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    shutdown('UNHANDLED REJECTION');
});
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
