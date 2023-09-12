import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandsRepository } from "../repositories/errands.repository";

interface ListErrandsParams {
  userid: string;
  description?: string;
  isArchived?: string;
}

export class ListErrandsUsecase implements Usecase {
  public async execute(params: ListErrandsParams): Promise<Result> {
    const user = await new UserRepository().getById(params.userid);

    if (!user) {
      return { ok: false, code: 401, message: "user not logged in" };
    }

    const cacheRepository = new CacheRepository();
    const resultCache = await cacheRepository.get(
      `Errands from user: ${params.userid}`
    );

    const isArchived = params.isArchived === "true" ? true : false;

    if (resultCache) {
      if (resultCache[0]?.isArchived === isArchived)
        return {
          ok: true,
          code: 200,
          message: "Errand list cache",
          data: resultCache,
        };
    }

    const errandList = await new ErrandsRepository().list({
      userid: params.userid,
      description: params.description,
      isArchived: isArchived,
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
      message: "Errand list",
      data: result,
    };
  }
}
