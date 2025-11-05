import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import {db} from "./config/quizConfig";
import {launchServer} from "./server";
import './schemas/testResult.schema';

process.on('uncaughtException', (err) => {
    console.error('💣 UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

console.log('🚧 Starting server initialization...');

(async () => {
await mongoose.connect(db)
    .then(() => {
        console.log('🟢 Database connected successfully');
        launchServer()
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
})();

const shutdown = async (signal: string) => {
    console.log(`👋 ${signal} received. Shutting down gracefully...`);

    try {
        await mongoose.connection.close();
        console.log('🔴 Database connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err: Error) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    shutdown('UNHANDLED REJECTION');
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
