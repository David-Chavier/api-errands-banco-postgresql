import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandsRepository } from "../repositories/errands.repository";

interface DeleteErrandParams {
  userid: string;
  errandid: string;
  isArchived: string;
}

export class DeleteErrandUsecase implements Usecase {
  public async execute(params: DeleteErrandParams): Promise<Result> {
    const user = new UserRepository().getById(params.userid);

    if (!user) {
      return { ok: false, code: 404, message: "user was not found" };
    }

    const errandRepository = new ErrandsRepository();
    const errandDeleted = await errandRepository.delete(params.errandid);

    if (!errandDeleted) {
      return { ok: false, code: 404, message: "Errand was not found" };
    }

    const result = await errandRepository.list({
      userid: params.userid,
      isArchived: params.isArchived === "true" ? true : false,
    });

    return {
      ok: true,
      code: 200,
      message: "Errand was successfully deleted",
      data: result.map((errand) => errand.toJson()),
    };
  }
}