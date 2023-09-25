import { Request, Response } from "express";
import { CreateErrandUsecase } from "../usecases/create-errand.usecase";
import { ListErrandsUsecase } from "../usecases/list-errands.usecase";
import { UpdateErrandsUsecase } from "../usecases/update-errand.usecase";
import { DeleteErrandUsecase } from "../usecases/delete-errand.usecase";
import { ListByErrandUsecase } from "../usecases/listbyid-errand.usecase";

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

  public async listById(req: Request, res: Response) {
    try {
      const { userid, errandid } = req.params;

      const result = await new ListByErrandUsecase().execute({
        userid,
        errandid,
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
        archive: archive === "true" ? true : false,
        isArchived: isArchived === "true" ? true : false,
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

      const result = await new DeleteErrandUsecase().execute({
        userid,
        errandid,
        isArchived: isArchived as string,
      });

      res.status(result.code).send(result);
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }
}
