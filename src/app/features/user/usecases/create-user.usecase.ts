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
    const userRepository = new UserRepository();

    const getByUsername = await userRepository.getByUsername(params.username);

    if (getByUsername) {
      return { ok: false, code: 403, message: "Username already taken" };
    }

    await userRepository.create(user);

    return {
      ok: true,
      code: 200,
      message: "user was created successfully",
      data: user.username,
    };
  }
}
