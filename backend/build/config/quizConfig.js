"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.baseUrl = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = 3555;
exports.baseUrl = `http://localhost:${exports.PORT}`;
exports.db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
