import { Database } from "../main/database/database.connection";
import { UserEntity } from "../database/entities/user.entity";
import { User } from "../app/models/user";

export class UserRepository {
  private repository = Database.connection.getRepository(UserEntity);

  public async list() {
    const result = await this.repository.find();

    return result.map((entity) => UserRepository.mapRowToModel(entity));
  }

  public async create(user: User) {
    const userEntity = this.repository.create({
      username: user.username,
      password: user.password,
    });

    await this.repository.save(userEntity);
  }

  public async login(possibleUser: User) {
    const result = await this.repository.findOne({
      where: {
        username: possibleUser.username,
        password: possibleUser.password,
      },
    });

    if (!result) {
      return undefined;
    }

    return UserRepository.mapRowToModel(result);
  }

  public async getByUsername(username: string) {
    const result = await this.repository.findOneBy({
      username: username,
    });

    return !!result;
  }

  public async getById(userId: string) {
    const result = await this.repository.findOne({ where: { userId: userId } });

    if (!result) {
      return undefined;
    }

    return UserRepository.mapRowToModel(result);
  }

  public update(user: User) {
    const result = this.repository.update(
      { userId: user.userId },
      { password: user.password }
    );
  }

  public async delete(userId: string) {
    const result = await this.repository.delete({ userId: userId });

    return result.affected ?? undefined;
  }

  public static mapRowToModel(row: UserEntity) {
    return User.create(row);
  }
}
