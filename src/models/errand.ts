import { v4 as createUuid } from "uuid";
import { users } from "../data/users";
import { ErrandEntity } from "../database/entities/errand.entity";
import { User } from "./user";

export class Errand {
  private _id: string;
  public isArchived: boolean;

  constructor(
    private _description: string,
    private _details: string,
    private _userId: string
  ) {
    this._id = createUuid();
    this.isArchived = false;
  }

  public get id() {
    return this._id;
  }

  public get details() {
    return this._details;
  }

  public get description() {
    return this._description;
  }

  public get userId() {
    return this._userId;
  }

  public set details(details: string) {
    this._details = details;
  }
  public set description(description: string) {
    this._description = description;
  }

  public set userId(userId: string) {
    this._userId = userId;
  }

  public toJson() {
    return {
      errandId: this.id,
      description: this.description,
      details: this.details,
      isArchived: this.isArchived,
    };
  }

  public static create(row: ErrandEntity, user: User) {
    const errand = new Errand(row.description, row.details, user.userId);
    errand._id = row.errandId;
    errand.isArchived = row.isArchived;

    return errand;
  }
}
