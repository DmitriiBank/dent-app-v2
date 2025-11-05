"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchServer = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./errorHandler/errorHandler");
const morgan_1 = __importDefault(require("morgan"));
const fs = __importStar(require("node:fs"));
// import dotenv from 'dotenv'
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import {sanitize} from 'express-mongo-sanitize';
// import hpp from 'hpp';
const userRouter_1 = require("./routes/userRouter");
const quizRouter_1 = require("./routes/quizRouter");
// import swaggerUi from "swagger-ui-express"
const node_path_1 = __importDefault(require("node:path"));
const express_mongo_sanitize_1 = require("express-mongo-sanitize");
const hpp_1 = __importDefault(require("hpp"));
const qs_1 = __importDefault(require("qs"));
// import swaggerDoc from "../docs/openapi.json" with {type: "json"};
const cors_1 = __importDefault(require("cors"));
const quizConfig_1 = require("./config/quizConfig");
const launchServer = () => {
    //=======load environment=====
    const __dirname = node_path_1.default.resolve();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: [
            "http://localhost:5173",
            "https://dmitriibank.github.io",
        ],
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    // ✅ Обработка preflight-запросов (OPTIONS)
    app.options("*", (0, cors_1.default)());
    app.use((0, helmet_1.default)({
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
        app.use((0, morgan_1.default)('dev'));
    }
    const logsDir = node_path_1.default.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    const accessLogStream = fs.createWriteStream(node_path_1.default.join(logsDir, 'access.log'), { flags: 'a' });
    const errorLogStream = fs.createWriteStream(node_path_1.default.join(logsDir, 'error.log'), { flags: 'a' });
    app.use((0, morgan_1.default)('combined', { stream: accessLogStream }));
    const limiter = (0, express_rate_limit_1.default)({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: 'Too many request from this IP, please try again in an hour!',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api', limiter);
    //===============Middleware============
    app.use(express_1.default.json({ limit: '10kb' }));
    app.set('query parser', (str) => qs_1.default.parse(str));
    app.use((req, res, next) => {
        if (req.body)
            (0, express_mongo_sanitize_1.sanitize)(req.body);
        if (req.params)
            (0, express_mongo_sanitize_1.sanitize)(req.params);
        // if (req.query) sanitize(req.query);
        next();
    });
    app.use((0, hpp_1.default)());
    app.use(express_1.default.static(`${__dirname}/public`));
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
    });
    // //==============Swagger Docs==========
    // app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
    //===============Router================
    app.use('/api/v1/quizzes', quizRouter_1.quizRouter);
    app.use('/api/v1/users', userRouter_1.userRouter);
    app.get('/', (_, res) => res.send('API is running'));
    app.use((req, res) => {
        res.status(404).json({
            status: 'fail',
            message: `Cannot find ${req.originalUrl} on this server`
        });
    });
    //=============Error===========
    app.use((0, morgan_1.default)('combined', {
        stream: errorLogStream,
        skip: (req, res) => res.statusCode < 400
    }));
    app.use(errorHandler_1.errorHandler);
    app.listen(process.env.PORT, () => console.log(`🚀 App running  at ${quizConfig_1.baseUrl}`));
};
exports.launchServer = launchServer;
