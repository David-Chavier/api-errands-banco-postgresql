import * as dotenv from "dotenv";
import { DataSource, Entity } from "typeorm";

dotenv.config();

let entities = ["src/database/entities/**/*.js"];
let migrations = ["src/database/migrations/**/*.js"];

if (process.env.DB_ENV === "production") {
  let entities = ["src/database/entities/**/*.js"];
  let migrations = ["src/database/migrations/**/*.js"];
}

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
  entities: entities,
  migrations: migrations,
});

export default config;
