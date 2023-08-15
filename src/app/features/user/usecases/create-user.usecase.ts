import { User } from "../../../models/user";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

interface CreateUserParams {
  username: string;
  password: string;
}

export class CreateUserUsecase implements Usecase {
  public async execute(params: CreateUserParams): Promise<Result> {
    const user = new User(params.username, params.password);
    await new UserRepository().create(user);

    return {
      ok: true,
      code: 200,
      message: "user was create successfully created",
      data: user.username,
    };
  }
}
