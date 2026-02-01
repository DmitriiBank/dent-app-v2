import 'express-async-errors';
import path from "node:path";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, {Application, NextFunction, Request, Response} from 'express'
import {sanitize} from "express-mongo-sanitize";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from "morgan";
import passport from 'passport';
import qs from 'qs';
import swaggerUi from "swagger-ui-express"

import swaggerDoc from "../docs/openapi.json";

import {baseUrl, PORT} from "./config/appConfig";
import {env} from "./config/env";
import {configurePassport} from './config/passportConfig';
import {errorHandler} from "./errorHandler/errorHandler";
import {logger} from "./Logger/winston";
import {authRouter} from "./routes/authRoutes";
import {quizRouter} from "./routes/quizRouter";
import {userRouter} from "./routes/userRouter";

export const createApp = () => {
    //=======load environment=====

    const __dirname = path.resolve();
    const app: Application = express();
    const SERVER = env.SERVER_URL;
    const FRONT = env.GOOGLE_CLIENT_URL;
    app.use(cookieParser());

    app.set('trust proxy', 1);

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
        // crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    }));

    app.use(
        morgan("combined", {
            stream: {
                write: (message) => logger.info(message.trim()),
            },
        })
    );

    //===============Middleware============
    app.use(express.json({limit: '10kb'}));
    app.set('query parser', (str: string) => qs.parse(str));


    app.use(
        cors({
            origin: [
                SERVER,
                FRONT
            ].filter(Boolean) as string[],
            methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept"],
            credentials: true
        })
    );


    const limiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: 'Too many request from this IP, please try again in an hour!',
        standardHeaders: true,
        legacyHeaders: false,
    })

    app.use(limiter);


    app.use((req, res, next) => {
        if (req.body) sanitize(req.body);
        if (req.params) sanitize(req.params);
        if (req.query) sanitize(req.query);
        next();
    });

    app.use(hpp())

    app.use(express.static(`${__dirname}/public`));

    app.use((req: Request, res: Response, next: NextFunction) => {
        req.requestTime = new Date().toISOString();
        next();
    });

    configurePassport()
    app.use(passport.initialize());
    // //==============Swagger Docs==========
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))


    //===============Router================
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/quizzes', quizRouter)
    app.use('/api/v1/users', userRouter);
    app.get('/', (_, res) => res.send('API is running'));


    app.use((req, res) => {
        res.status(404).json({
            status: 'fail',
            message: `Cannot find ${req.originalUrl} on this server`
        });
    });

//=============Error===========
//     app.use(morgan('combined', {
//         stream: errorLogStream,
//         skip: (req, res) => res.statusCode < 400
//     }));

    app.use(errorHandler)
    return app;
};

export const launchServer = () => {
    const app = createApp();
    app.listen(PORT, () => {
        logger.info(`App running at ${baseUrl}`);
        logger.info(`SERVER_URL: ${env.SERVER_URL ?? "not set"}`);
        logger.info(`GOOGLE_CLIENT_URL: ${env.GOOGLE_CLIENT_URL ?? "not set"}`);
    });
};