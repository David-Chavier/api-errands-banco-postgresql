import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

export class DeleteUserUsecase implements Usecase {
  public async execute(userid: string): Promise<Result> {
    const userRepository = new UserRepository();
    const userDeleted = await userRepository.delete(userid);

    if (!userDeleted) {
      return { ok: false, code: 404, message: "user was not found" };
    }

    const result = await userRepository.list();

    return {
      ok: true,
      code: 200,
      message: "user was sucessfully deleted",
      data: result.map((user) => user.toJson()),
    };
  }
}
