import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
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
    const user = await new UserRepository().getById(params.userid);

    if (!user) {
      return { ok: false, code: 401, message: "user was not found" };
    }

    const errandRepository = new ErrandsRepository();
    const errandDeleted = await errandRepository.delete(params.errandid);

    if (!errandDeleted) {
      return { ok: false, code: 404, message: "Errand was not found" };
    }

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(`Errands from user: ${params.userid}`);
    await cacheRepository.delete(`Errand: ${params.errandid}`);

    const errandList = await errandRepository.list({
      userid: params.userid,
      isArchived: params.isArchived === "true" ? true : false,
    });

    const result = errandList.map((errand) => errand.toJson());

    await cacheRepository.setEx(
      `Errands from user: ${params.userid}`,
      300000,
      result
    );

    return {
      ok: true,
      code: 200,
      message: "Errand was successfully deleted",
      data: result,
    };
  }
}
