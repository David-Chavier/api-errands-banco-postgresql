import * as dotenv from "dotenv";
dotenv.config();

export default {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASS!,
};
