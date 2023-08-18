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
      return { ok: false, code: 404, message: "User was not found" };
    }

    const listErrands = await new ErrandsRepository().list({
      userid: params.userid,
      description: params.description,
      isArchived: params.isArchived === "true" ? true : false,
    });

    return {
      ok: true,
      code: 200,
      message: "Errand list",
      data: listErrands.map((errand) => errand.toJson()),
    };
  }
}
