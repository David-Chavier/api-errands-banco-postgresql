import { Database } from "./main/database/database.connection";
import "reflect-metadata";
import { Server } from "./main/server/express.server";

Database.connect().then(() => {
  console.log("Database is connected");
  Server.listen();
});
