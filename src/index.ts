import { Database } from "./main/database/database.connection";
import "reflect-metadata";
import { Server } from "./main/server/express.server";
import { CacheDatabase } from "./main/database/redis.connection";
import { createApp } from "./main/config/express.config";

Promise.all([Database.connect(), CacheDatabase.connect()]).then(() => {
  Server.listen();
});
