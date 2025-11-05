"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const quizConfig_1 = require("./config/quizConfig");
const server_1 = require("./server");
require("./schemas/testResult.schema");
process.on('uncaughtException', (err) => {
    console.error('💣 UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});
console.log('🚧 Starting server initialization...');
(async () => {
    await mongoose_1.default.connect(quizConfig_1.db)
        .then(() => {
        console.log('🟢 Database connected successfully');
        (0, server_1.launchServer)();
    })
        .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
})();
const shutdown = async (signal) => {
    console.log(`👋 ${signal} received. Shutting down gracefully...`);
    try {
        await mongoose_1.default.connection.close();
        console.log('🔴 Database connection closed');
        process.exit(0);
    }
    catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};
process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    shutdown('UNHANDLED REJECTION');
});
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
