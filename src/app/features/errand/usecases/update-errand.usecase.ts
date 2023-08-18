import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandsRepository } from "../repositories/errands.repository";

interface UpdateErrandsParams {
  userid: string;
  errandid: string;
  description: string;
  details: string;
  archive: boolean;
  isArchived: string;
}

export class UpdateErrandsUsecase implements Usecase {
  public async execute(params: UpdateErrandsParams): Promise<Result> {
    const user = await new UserRepository().getById(params.userid);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "user was not found",
      };
    }

    const errandRepository = new ErrandsRepository();

    const errand = await errandRepository.getById(params.errandid);

    if (!errand) {
      return { ok: false, code: 404, message: "Errand was not found" };
    }

    if (params.description) {
      errand.description = params.description;
    }

    if (params.details) {
      errand.details = params.details;
    }

    errand.isArchived = params.archive ?? errand.isArchived;

    await errandRepository.update(errand);

    const result = await errandRepository.list({
      userid: params.userid,
      isArchived: params.isArchived === "true" ? true : false,
    });

    return {
      ok: true,
      code: 200,
      message: "Errand was successfully update",
      data: result.map((errand) => errand.toJson()),
    };
  }
}
