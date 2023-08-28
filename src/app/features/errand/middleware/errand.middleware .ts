import { NextFunction, Request, Response } from "express";

export class ErrandMiddleware {
  public static validateCreateErrand(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid } = req.params;
      const { description } = req.body;

      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const result = uuidPattern.test(userid);

      if (!result) {
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

      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const result = uuidPattern.test(userid);

      if (!result) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
    next();
  }

  public static validateListByIdErrand(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid, errandid } = req.params;

      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const validateUserid = uuidPattern.test(userid);

      if (!validateUserid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }

      const validateErrandid = uuidPattern.test(errandid);

      if (!validateErrandid) {
        return res
          .status(401)
          .send({ ok: false, message: "unidentified errand" });
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

      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const validateUserid = uuidPattern.test(userid);

      if (!validateUserid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }

      const validateErrandid = uuidPattern.test(errandid);

      if (!validateErrandid) {
        return res
          .status(401)
          .send({ ok: false, message: "unidentified errand" });
      }

      if (!description && !details && !archived) {
        return res
          .status(400)
          .send({ ok: false, message: "No value change was requested" });
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

      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const validateUserid = uuidPattern.test(userid);

      if (!validateUserid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }

      const validateErrandid = uuidPattern.test(errandid);

      if (!validateErrandid) {
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
