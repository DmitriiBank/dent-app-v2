import express from 'express';
import { errorHandler } from "./errorHandler/errorHandler.js";
import morgan from "morgan";
import * as fs from "node:fs";
// import dotenv from 'dotenv'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import {sanitize} from 'express-mongo-sanitize';
// import hpp from 'hpp';
import { userRouter } from "./routes/userRouter.js";
import { quizRouter } from "./routes/quizRouter.js";
// import {questionRouter} from "./routes/questionRouter.js";
// import swaggerUi from "swagger-ui-express"
import path from "node:path";
// import {authentication, skipRoutes} from "./middleware/authentication.js";
// import {authorize} from "./middleware/authorization.js";
// import {accountServiceImplMongo} from "./services/AccountServiceImplMongo.js";
// import swaggerDoc from "../docs/openapi.json" with {type: "json"};
export const launchServer = () => {
    //=======load environment=====
    // dotenv.config();
    console.log(process.env);
    const app = express();
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            }
        },
        crossOriginEmbedderPolicy: false,
    }));
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: logStream }));
    const limiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: 'Too many request from this IP, please try again in an hour!'
    });
    app.use('/api', limiter);
    //===============Middleware============
    app.use(express.json({ limit: '10kb' }));
    // app.use(authentication(accountServiceImplMongo));
    // app.use(skipRoutes(configuration.skipRoutes))
    // app.use(authorize(configuration.pathRoles));
    // app.use(checkAccountById(configuration.checkIdRoutes));
    // //==============Swagger Docs==========
    // app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
    //===============Router================
    app.use('/api/v1/quizzes', quizRouter);
    app.get('/', (_, res) => res.send('API is running'));
    app.use('/api/v1/users', userRouter);
    // app.use('/api/v1/questions', questionRouter);
    app.use((req, res) => {
        res.status(404).send("Page not fount");
    });
    //=============Error===========
    const errorStream = fs.createWriteStream('error.log', { flags: 'a' });
    app.use(morgan('combined', { stream: errorStream }));
    app.use(errorHandler);
    app.listen(process.env.PORT, () => console.log(`🚀 App running  at http://localhost:${process.env.PORT}`));
};
