import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

interface UpdateUserParams {
  userid: string;
  currentPassword: string;
  newPassword: string;
}

export class UpdateUserUsecase implements Usecase {
  public async execute(params: UpdateUserParams): Promise<Result> {
    const userRepository = new UserRepository();

    const user = await userRepository.getById(params.userid);

    if (!user) {
      return { ok: false, code: 404, message: "User was not found" };
    }

    if (user.password !== params.currentPassword) {
      return { ok: false, code: 400, message: "Invalid current password" };
    }

    user.password = params.newPassword;

    userRepository.update(user);

    return {
      ok: true,
      code: 200,
      message: "Password was successfully update",
      data: user.toJson(),
    };
  }
}
