import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { ErrandEntity } from "../../app/shared/database/entities/errand.entity";
import { UserEntity } from "../../app/shared/database/entities/user.entity";
import { createTables1690032276731 } from "../../app/shared/database/migrations/1690032276731-createTables";
import { errandEntityDefaltTrue1690238885289 } from "../../app/shared/database/migrations/1690238885289-errandEntityDefaltTrue";

dotenv.config();

// let entities = ["src/database/entities/**/*.ts"];
// let migrations = ["src/database/migrations/**/*.ts"];

// if (process.env.DB_ENV === "production") {
//   let entities = ["src/database/entities/**/*.js"];
//   let migrations = ["src/database/migrations/**/*.js"];
// }

let config = new DataSource({
  type: "postgres",
  port: 5432,
  url: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  schema: "errands",
  entities: [ErrandEntity, UserEntity],
  migrations: [createTables1690032276731, errandEntityDefaltTrue1690238885289],
});

if (process.env.DB_ENV === "test") {
  config = new DataSource({
    type: "sqlite",
    database: "db.sqlite3",
    synchronize: false,
    entities: [ErrandEntity, UserEntity],
    migrations: ["tests/app/shared/database/migrations/**/*.ts"],
  });
}

export default config;
