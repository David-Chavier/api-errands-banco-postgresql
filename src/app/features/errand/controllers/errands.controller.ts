import { Request, Response } from "express";
import { Errand } from "../../../models/errand";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandsRepository } from "../repositories/errands.repository";
import { CreateErrandUsecase } from "../usecases/create-errand.usecase";
import { ListErrandsUsecase } from "../usecases/list-errands.usecase";
import { UpdateErrandsUsecase } from "../usecases/update-errand.usecase";

export class ErrandsController {
  public async create(req: Request, res: Response) {
    try {
      const { userid } = req.params;
      const { description, details } = req.body;
      const { isArchived } = req.query;

      const isArquivedString = isArchived?.toString();

      const result = await new CreateErrandUsecase().execute({
        userid,
        description,
        details,
        isArchived: isArquivedString,
      });

      res.status(result.code).send(result);
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const { userid } = req.params;
      const { description, isArchived } = req.query;

      const result = await new ListErrandsUsecase().execute({
        userid,
        description: (description as string) || undefined,
        isArchived: (isArchived as string) || undefined,
      });

      res.status(result.code).send(result);
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { userid, errandid } = req.params;
      const { description, details, archive } = req.body;
      const { isArchived } = req.query;

      const result = await new UpdateErrandsUsecase().execute({
        userid,
        errandid,
        description,
        details,
        archive,
        isArchived: isArchived as string,
      });

      res.status(result.code).send(result);
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { userid, errandid } = req.params;
      const { isArchived } = req.query;

      const user = await new UserRepository().getById(userid);

      if (!user) {
        return res
          .status(404)
          .send({ ok: false, message: "user was not found" });
      }

      const errand = await new ErrandsRepository().delete(errandid);

      if (!errand) {
        return res
          .status(404)
          .send({ ok: false, message: "Errand was not found" });
      }

      const errands = await new ErrandsRepository().list({
        userid: userid,
        isArchived: isArchived === "true" ? true : false,
      });

      res.status(200).send({
        ok: true,
        message: "Errand was successfully delete",
        data: errands.map((errand) => errand.toJson()),
      });
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }
}
