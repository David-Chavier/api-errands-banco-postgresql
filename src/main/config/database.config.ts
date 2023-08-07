import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { ErrandEntity } from "../../database/entities/errand.entity";
import { UserEntity } from "../../database/entities/user.entity";
import { createTables1690032276731 } from "../../database/migrations/1690032276731-createTables";
import { errandEntityDefaltTrue1690238885289 } from "../../database/migrations/1690238885289-errandEntityDefaltTrue";

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
  logging: true,
  synchronize: false,
  schema: "errands",
  entities: [ErrandEntity, UserEntity],
  migrations: [createTables1690032276731, errandEntityDefaltTrue1690238885289],
});

export default config;
