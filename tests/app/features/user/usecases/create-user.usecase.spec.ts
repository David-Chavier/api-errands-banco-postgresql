import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";

import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";

describe("testando usecase de criação de um usuario", () => {
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
    return new CreateUserUsecase();
  };

  test("Deveria retornar erro 403 se o username já existir no banco de dados", async () => {
    const sut = createSut();

    const user = new User("any_name", "12345");

    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(true);

    const result = await sut.execute({
      username: "any_name",
      password: "12345",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(403);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 403);
    expect(result.message).toBe("Username already taken");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar 200 se o usuario for criado", async () => {
    const sut = createSut();
    const user = new User("any_name", "12345");

    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(false);

    const result = await sut.execute({
      username: "any_name",
      password: "12345",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("user was created successfully");
    expect(result.data).toStrictEqual(user.username);
  });
});
