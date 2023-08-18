import { Errand } from "../../../models/errand";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandsRepository } from "../repositories/errands.repository";

interface CreateErrandsParams {
  userid: string;
  description: string;
  details: string;
  isArchived?: string;
}

export class CreateErrandUsecase implements Usecase {
  public async execute(params: CreateErrandsParams): Promise<Result> {
    const errand = new Errand(
      params.description,
      params.details,
      params.userid
    );

    const user = await new UserRepository().getById(params.userid);

    if (!user) {
      return {
        ok: false,
        code: 404,
        message: "user was not found",
      };
    }

    await new ErrandsRepository().create(errand);
    const result = await new ErrandsRepository().list({
      userid: params.userid,
      isArchived: params.isArchived === "true" ? true : false,
    });

    return {
      ok: true,
      code: 200,
      message: "Errand was successfully add",
      data: result.map((errand) => errand.toJson()),
    };
  }
}
