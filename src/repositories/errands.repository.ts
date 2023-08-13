import { Database } from "../main/database/database.connection";
import { ErrandEntity } from "../database/entities/errand.entity";
import { Errand } from "../app/models/errand";
import { UserRepository } from "./user.repository";

interface ListErrandsParams {
  userid: string;
  description?: string;
  isArchived?: boolean;
}

export class ErrandsRepository {
  private repository = Database.connection.getRepository(ErrandEntity);

  public async list(params: ListErrandsParams) {
    const result = await this.repository.find({
      where: {
        idUser: params.userid,
        description: params.description,
        isArchived: params.isArchived,
      },
      relations: { user: true },
    });

    return result.map((entity) => this.mapRowToModel(entity));
  }

  public async create(errand: Errand) {
    const errandEntity = await this.repository.create({
      idUser: errand.userId,
      description: errand.description,
      details: errand.details,
    });

    await this.repository.save(errandEntity);
  }

  public async update(errand: Errand) {
    await this.repository.update(
      {
        errandId: errand.id,
      },
      {
        description: errand.description,
        details: errand.details,
        isArchived: errand.isArchived,
      }
    );
  }

  public async delete(errandId: string) {
    const result = await this.repository.delete({ errandId: errandId });

    return result.affected ?? undefined;
  }

  public async getById(errandId: string) {
    const result = await this.repository.findOne({
      where: { errandId: errandId },
      relations: { user: true },
    });

    if (!result) {
      return undefined;
    }

    return this.mapRowToModel(result);
  }

  private mapRowToModel(row: ErrandEntity) {
    const user = UserRepository.mapRowToModel(row.user);
    return Errand.create(row, user);
  }
}
