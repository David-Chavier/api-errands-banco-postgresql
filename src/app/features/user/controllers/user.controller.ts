import { Request, Response } from "express";
import { User } from "../../../models/user";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { ListUserUsecase } from "../usecases/list-user.usecase";
import { LoginUsecase } from "../usecases/login.usecase";

export class UserController {
  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const result = await new LoginUsecase().execute(req.body);

      res.status(result.code).send(result);
    } catch (err: any) {
      return res.status(500).send({
        ok: false,
        message: err.toString(),
      });
    }
  }
  public async create(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const result = await new CreateUserUsecase().execute(req.body);

      return res.status(result.code).send(result);
    } catch (err: any) {
      return res.status(500).send({
        ok: false,
        message: err.toString(),
      });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const result = await new ListUserUsecase().execute();

      return res.status(result.code).send(result);
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
