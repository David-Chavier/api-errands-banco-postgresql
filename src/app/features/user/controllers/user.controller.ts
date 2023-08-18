import { Request, Response } from "express";
import { User } from "../../../models/user";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserUsecase } from "../usecases/create-user.usecase";
import { ListUserUsecase } from "../usecases/list-user.usecase";
import { LoginUsecase } from "../usecases/login.usecase";
import { DeleteUserUsecase } from "../usecases/delete-user.usecase";
import { UpdateUserUsecase } from "../usecases/update-user.usecase";

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
      const { currentPassword, newPassword } = req.body;

      const result = await new UpdateUserUsecase().execute({
        userid,
        currentPassword,
        newPassword,
      });

      res.status(result.code).send(result);
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

      const result = await new DeleteUserUsecase().execute(userid);

      return res.status(result.code).send(result);
    } catch (err: any) {
      return res.status(500).send({ ok: false, message: err.toString() });
    }
  }
}
