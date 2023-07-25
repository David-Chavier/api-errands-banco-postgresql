import { Router } from "express";
import { UserMiddleware } from "../middleware/user.middleware";
import { UserController } from "../controllers/user.controller";
import { errandRoutes } from "./errand.routes";

export const userRoutes = () => {
  const app = Router();

  app.post(
    "/",
    [UserMiddleware.validateCreateUser],
    new UserController().create
  );

  app.post("/", [UserMiddleware.validateLogin], new UserController().login);

  app.get("/", new UserController().list);

  app.put(
    "/:userid",
    [UserMiddleware.validateUpdateUser],
    new UserController().update
  );

  app.delete(
    "/:userid",
    [UserMiddleware.validateDeleteUser],
    new UserController().delete
  );

  app.use("/:userid/errand", errandRoutes());
  return app;
};
