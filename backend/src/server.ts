import 'express-async-errors';
import express, {Application, NextFunction, Request, Response} from 'express'
import {errorHandler} from "./errorHandler/errorHandler";
import morgan from "morgan";
import * as fs from "node:fs";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {userRouter} from "./routes/userRouter";
import {quizRouter} from "./routes/quizRouter";
import swaggerUi from "swagger-ui-express"
import path from "node:path";
import {sanitize} from "express-mongo-sanitize";
import hpp from 'hpp';
import qs from 'qs';
import swaggerDoc from "../docs/openapi.json";
import cors from "cors";
import {baseUrl} from "./config/appConfig";
import passport, {session} from 'passport';
import cookieParser from 'cookie-parser';
import './config/passportConfig';
import {configurePassport} from "./config/passportConfig";

export const createApp = () => {
    //=======load environment=====

    const __dirname = path.resolve();
    const app: Application = express();

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
    }));

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, {recursive: true});
    }

    const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), {flags: 'a'});
    const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), {flags: 'a'});

    app.use(morgan('combined', {stream: accessLogStream}))



    //===============Middleware============
    app.use(express.json({limit: '10kb'}));
    app.set('query parser', (str: string) => qs.parse(str));
    app.use(cookieParser());


    app.use(
        cors({
            origin: [
                "http://localhost:5173",
                "https://dent-app-v2.vercel.app",
                "https://dent-app-v2.onrender.com"
            ].filter(Boolean) as string[],
            credentials: true,
            methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            exposedHeaders: ['Set-Cookie'],
        })
    );

    app.options("*", cors());

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
    app.use(morgan('combined', {
        stream: errorLogStream,
        skip: (req, res) => res.statusCode < 400
    }));

    app.use(errorHandler)
    return app;
};

export const launchServer = () => {
    const app = createApp();
    app.listen(process.env.PORT, () =>
        console.log(`🚀 App running at ${baseUrl}`)
    );
};