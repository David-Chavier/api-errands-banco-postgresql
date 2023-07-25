import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes";
import { userLogin } from "./routes/login.routes";
import { Database } from "./database/config/database.connection";
import "reflect-metadata";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes());
app.use("/login", userLogin());

const PORT = process.env.PORT;

Database.connect().then(() => {
  console.log("Conectou ao banco de dados");

  app.listen(PORT, () => {
    console.log(`app is running ${PORT}`);
  });
});
