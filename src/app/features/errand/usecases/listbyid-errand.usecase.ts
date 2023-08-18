import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandsRepository } from "../repositories/errands.repository";

interface ListByIdErrandParams {
  userid: string;
  errandid: string;
}

export class ListByErrandUsecase implements Usecase {
  public async execute(params: ListByIdErrandParams): Promise<Result> {
    const user = await new UserRepository().getById(params.userid);

    if (!user) {
      return { ok: false, code: 404, message: "User was not found" };
    }

    const cacheRepository = new CacheRepository();
    const resultCache = await cacheRepository.get(`Errand: ${params.errandid}`);

    if (resultCache) {
      return {
        ok: true,
        code: 200,
        message: "Errand requested cache",
        data: resultCache,
      };
    }

    const errand = await new ErrandsRepository().getById(params.errandid);

    if (!errand) {
      return { ok: false, code: 404, message: "Errand was not found" };
    }

    const result = errand.toJson();

    await cacheRepository.setEx(`Errand: ${params.errandid}`, 300000, result);

    return { ok: true, code: 200, message: "Errand requested", data: result };
  }
}
