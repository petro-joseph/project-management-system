import { DataSourceOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const databaseConfig: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "project_management",
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
};