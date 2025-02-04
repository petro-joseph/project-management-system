"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("../src/config/data-source");
const error_middleware_1 = require("../src/middleware/error.middleware");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes will be added here
// Error handling middleware should be last
app.use((err, req, res, next) => {
    (0, error_middleware_1.errorHandler)(err, req, res, next);
});
// Database connection
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connected successfully');
})
    .catch((error) => console.log('TypeORM connection error: ', error));
exports.default = app;
