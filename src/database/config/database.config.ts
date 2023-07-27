import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

// let entities = ["src/database/entities/**/*.ts"];
// let migrations = ["src/database/migrations/**/*.ts"];

// if (process.env.DB_ENV === "production") {
//   let entities = ["src/database/entities/**/*.js"];
//   let migrations = ["src/database/migrations/**/*.js"];
// }

const config = new DataSource({
  type: "postgres",
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  schema: "errands",
  entities: ["src/database/entities/**/*.js"],
  migrations: ["src/database/migrations/**/*.js"],
});

export default config;
