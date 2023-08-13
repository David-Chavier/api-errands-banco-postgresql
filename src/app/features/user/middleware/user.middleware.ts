import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";

export class UserMiddleware {
  public static validateLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .send({ ok: false, message: "Fill in the fields and try again" });
      }
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }

    next();
  }

  public static async validateCreateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .send({ ok: false, message: "Fill in the fields and try again" });
      }

      if (username.length < 4) {
        return res.status(400).send({
          ok: false,
          message: "Username is mandatory to have at least 4 characters",
        });
      }

      if (password.length < 8) {
        return res.status(400).send({
          ok: false,
          message: "Password is mandatory to have at least 8 characters",
        });
      }

      if (await new UserRepository().getByUsername(username)) {
        return res
          .status(400)
          .send({ ok: false, message: "Username already taken" });
      }

      next();
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }

  public static validateUpdateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid } = req.params;
      const { password } = req.body;

      if (!userid) {
        return res
          .status(401)
          .send({ ok: false, message: "user not logged in" });
      }

      if (!password) {
        return res
          .status(404)
          .send({ ok: false, message: "new password not informed" });
      }

      if (password.length < 8) {
        return res.status(400).send({
          ok: false,
          message: "Password is mandatory to have at least 8 characters",
        });
      }
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
    next();
  }

  public static validateDeleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userid } = req.params;
      const { password } = req.body;

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
}
