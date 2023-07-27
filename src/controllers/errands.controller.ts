import { Request, Response } from "express";
import { Errand } from "../models/errand";
import { UserRepository } from "../repositories/user.repository";
import { ErrandsRepository } from "../repositories/errands.repository";

export class ErrandsController {
  public async create(req: Request, res: Response) {
    try {
      const { userid } = req.params;
      const { description, details } = req.body;
      const { isArchived } = req.query;

      const user = await new UserRepository().getById(userid);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "user was not found",
        });
      }

      const errand = new Errand(description, details, userid);
      await new ErrandsRepository().create(errand);

      const errands = await new ErrandsRepository().list({
        userid: userid,
        isArchived: isArchived === "true" ? true : false,
      });

      res.status(200).send({
        ok: true,
        message: "Errand was successfully add",
        data: errands.map((errand) => errand.toJson()),
      });
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const { userid } = req.params;
      const { description, isArchived } = req.query;

      const user = await new UserRepository().getById(userid);

      console.log(isArchived);
      if (!user) {
        return res
          .status(404)
          .send({ ok: false, message: "user was not found" });
      }

      const filteredErrands = await new ErrandsRepository().list({
        userid: userid,
        description: description as string,
        isArchived: isArchived === "true" ? true : false,
      });

      res.status(200).send({
        ok: true,
        data: filteredErrands.map((errand) => errand.toJson()),
      });
    } catch (err: any) {
      res.status(500).send({ ok: false, message: err.toString() });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { userid, errandid } = req.params;
      const { description, details, archive } = req.body;
      const { isArchived } = req.query;

      const user = await new UserRepository().getById(userid);

      if (!user) {
        return res
          .status(404)
          .send({ ok: false, message: "user was not found" });
      }

      const errandRepository = new ErrandsRepository();
      const errand = await errandRepository.getById(errandid);

      if (!errand) {
        return res
          .status(404)
          .send({ ok: false, message: "Errand was not found" });
      }

      if (description) {
        errand.description = description;
      }

      if (details) {
        errand.details = details;
      }

      errand.isArchived = archive ?? errand.isArchived;

      await errandRepository.update(errand);

      const errands = await new ErrandsRepository().list({
        userid: userid,
        isArchived: isArchived === "true" ? true : false,
      });

      res.status(200).send({
        ok: true,
        message: "Errand was successfully update",
        data: errands.map((errand) => errand.toJson()),
      });
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
