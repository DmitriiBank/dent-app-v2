
import mongoose from "mongoose";

import {db} from "./config/appConfig";
import { logger } from "./Logger/winston";
import {launchServer} from "./server";
import './schemas/testResult.schema';

process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
});

logger.info('Starting server initialization...');

(async () => {
    await mongoose.connect(db)
        .then(() => {
            logger.info('Database connected successfully');
            launchServer()
        })
        .catch(err => {
            logger.error('MongoDB connection error', err);
            process.exit(1);
        });
})();

const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    try {
        await mongoose.connection.close();
        logger.info('Database connection closed');
        process.exit(0);
    } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', err);
    shutdown('UNHANDLED REJECTION');
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
