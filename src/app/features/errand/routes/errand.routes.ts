import { Router } from "express";
import { ErrandMiddleware } from "../middleware/errand.middleware ";
import { ErrandsController } from "../controllers/errands.controller";

export const errandRoutes = () => {
  const app = Router({
    mergeParams: true,
  });

  app.post(
    "/",
    [ErrandMiddleware.validateCreateErrand],
    new ErrandsController().create
  );

  app.get(
    "/",
    [ErrandMiddleware.validateListErrand],
    new ErrandsController().list
  );

  app.get(
    "/:errandid",
    [ErrandMiddleware.validateListErrand],
    new ErrandsController().listById
  );

  app.put(
    "/:errandid",
    [ErrandMiddleware.validateUpdateErrand],
    new ErrandsController().update
  );

  app.delete(
    "/:errandid",
    [ErrandMiddleware.validateDeleteErrand],
    new ErrandsController().delete
  );

  return app;
};
