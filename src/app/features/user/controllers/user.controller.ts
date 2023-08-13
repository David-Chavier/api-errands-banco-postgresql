import { Request, Response } from "express";
import { User } from "../../../models/user";
import { UserRepository } from "../../../../repositories/user.repository";

export class UserController {
  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = new User(username, password);
      const userValidation = await new UserRepository().login(user);

      if (!userValidation) {
        return res
          .status(401)
          .send({ ok: false, message: "invalid username or password" });
      }
      res.status(200).send({
        ok: true,
        message: "logged in user",
        data: userValidation.toJson(),
      });
    } catch (err: any) {
      return res.status(500).send({
        ok: false,
        message: err.toString(),
      });
    }
  }
  public create(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = new User(username, password);
      new UserRepository().create(user);

      return res.status(200).send({
        ok: true,
        message: "user was create successfully created",
        data: user.username,
      });
    } catch (err: any) {
      return res.status(500).send({
        ok: false,
        message: err.toString(),
      });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const repository = new UserRepository();
      const result = await repository.list();

      return res
        .status(200)
        .send({ ok: true, data: result.map((user) => user.toJson()) });
    } catch (err: any) {
      return res.status(500).send({ ok: false, message: err.toString() });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { userid } = req.params;
      const { password } = req.body;

      const userRepository = new UserRepository();

      const user = await userRepository.getById(userid);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "user was not found",
        });
      }

      if (password) {
        user.password = password;
      }

      userRepository.update(user);

      res.status(200).send({
        ok: true,
        message: "Password was successfully update",
      });
    } catch (err: any) {
      return res.status(500).send({
        ok: false,
        message: err.toString(),
      });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { userid } = req.params;

      const user = await new UserRepository().delete(userid);

      if (!user) {
        return res
          .status(404)
          .send({ ok: false, message: "user was not found" });
      }

      const users = await new UserRepository().list();

      return res.status(200).send({
        ok: true,
        message: "user was sucessfully deleted",
        data: users.map((user) => user.toJson()),
      });
    } catch (err: any) {
      return res.status(500).send({ ok: false, message: err.toString() });
    }
  }
}
