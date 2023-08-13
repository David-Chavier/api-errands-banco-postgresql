import { v4 as createUuid } from "uuid";
import { UserEntity } from "../shared/database/entities/user.entity";

export class User {
  private _userId: string;

  constructor(private _username: string, private _password: string) {
    this._userId = createUuid();
  }

  public get userId() {
    return this._userId;
  }

  public get username() {
    return this._username;
  }

  public get password() {
    return this._password;
  }

  public set username(username: string) {
    this._username = username;
  }

  public set password(passoword: string) {
    this._password = passoword;
  }

  public toJson() {
    return {
      userId: this._userId,
      username: this.username,
    };
  }

  public static create(row: UserEntity) {
    const user = new User(row.username, row.password);
    user._userId = row.userId;

    return user;
  }
}
