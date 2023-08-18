import { User } from "../../../models/user";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

interface LoginUsecaseParams {
  username: string;
  password: string;
}

export class LoginUsecase implements Usecase {
  public async execute(params: LoginUsecaseParams): Promise<Result> {
    const user = new User(params.username, params.password);
    const repository = await new UserRepository().login(user);

    if (!repository) {
      return { ok: false, code: 401, message: "invalid username or password" };
    }

    return {
      ok: true,
      code: 200,
      message: "logged in user",
      data: repository.toJson(),
    };
  }
}
