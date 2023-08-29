import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";

import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { ListUserUsecase } from "../../../../../src/app/features/user/usecases/list-user.usecase";

describe("testando usecase de listagem de usuarios", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  beforeEach(async () => {
    const repository = Database.connection.getRepository(UserEntity);

    await repository.clear();
  });

  const createSut = () => {
    return new ListUserUsecase();
  };

  test("Deveria retornar 200 os usuários forem listados", async () => {
    const sut = createSut();

    const user = new User("any_name", "12345");

    jest.spyOn(UserRepository.prototype, "list").mockResolvedValue([user]);

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Registered users");
    expect(result.data).toStrictEqual([user.toJson()]);
  });
});
