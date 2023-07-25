import { NextFunction, Request, Response } from "express";
import { users } from "../data/users";

export class ErrandMiddleware {
  public static validateCreateErrand(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid } = req.params;
      const { description } = req.body;

      if (!userid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }

      if (!description) {
        return res.status(400).send({
          ok: false,
          message: "need to pass a description for the errand",
        });
      }
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
    next();
  }

  public static validateListErrand(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid } = req.params;

      if (!userid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
    next();
  }

  public static validateUpdateErrand(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid, errandid } = req.params;
      const { description, details, archived } = req.body;

      if (!userid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }

      if (!errandid) {
        return res
          .status(401)
          .send({ ok: false, message: "unidentified errand" });
      }

      if (!description && !details && !archived) {
        return res
          .status(400)
          .send({ ok: false, message: "No value change was requested " });
      }
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
    next();
  }

  public static validateDeleteErrand(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid, errandid } = req.params;

      if (!userid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }

      if (!errandid) {
        return res
          .status(401)
          .send({ ok: false, message: "unidentified errand" });
      }
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
    next();
  }
}
