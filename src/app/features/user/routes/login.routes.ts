import { Router } from "express";
import { UserMiddleware } from "../middleware/user.middleware";
import { UserController } from "../controllers/user.controller";

export const userLogin = () => {
  const app = Router();

  app.post("/", [UserMiddleware.validateLogin], new UserController().login);

  return app;
};
