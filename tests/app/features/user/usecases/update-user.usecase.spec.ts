import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";

import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { UpdateUserUsecase } from "../../../../../src/app/features/user/usecases/update-user.usecase";

describe("testando usecase de update de um usuario", () => {
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
    return new UpdateUserUsecase();
  };

  test("Deveria retornar erro 404 se usuario não for encontrado no banco de dados", async () => {
    const sut = createSut();

    const result = await sut.execute({
      userid: "any_name",
      currentPassword: "12345",
      newPassword: "sfsfwdf",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 404);
    expect(result.message).toBe("User was not found");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 400 se a currentPassword informado estiver incorreta", async () => {
    const sut = createSut();

    const user = new User("any_name", "12345");

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);

    const result = await sut.execute({
      userid: "any_name",
      currentPassword: "1234",
      newPassword: "sfsfwdf",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 400);
    expect(result.message).toBe("Invalid current password");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar 200 se o usuario for criado", async () => {
    const sut = createSut();
    const user = new User("any_name", "12345");

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);

    const result = await sut.execute({
      userid: "any_name",
      currentPassword: "12345",
      newPassword: "sfsfwdf",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Password was successfully update");
    expect(result.data).toStrictEqual(user.toJson());
  });
});
