import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

export class ListUserUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const result = await new UserRepository().list();

    return {
      ok: true,
      code: 200,
      message: "Registered users",
      data: result.map((user) => user.toJson()),
    };
  }
}
