import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";

import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { CreateErrandUsecase } from "../../../../../src/app/features/errand/usecases/create-errand.usecase";
import { Errand } from "../../../../../src/app/models/errand";
import { ErrandsRepository } from "../../../../../src/app/features/errand/repositories/errands.repository";
import { ListByErrandUsecase } from "../../../../../src/app/features/errand/usecases/listbyid-errand.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("testando usecase de listagem de recados por id", () => {
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
    return new ListByErrandUsecase();
  };

  test("Deveria retornar erro 401 se usuário não for encotrado no banco de dados", async () => {
    const sut = createSut();

    const result = await sut.execute({
      userid: "userid",
      errandid: "errandid",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(401);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 401);
    expect(result.message).toBe("user not logged in");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 404 se o recado não for encotrado no banco de dados", async () => {
    const sut = createSut();
    const user = new User("any_name", "12345");
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);

    const result = await sut.execute({
      userid: "userid",
      errandid: "errandid",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 404);
    expect(result.message).toBe("Errand was not found");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar 200 se os recados forem listados em cache", async () => {
    const sut = createSut();
    const user = new User("any_name", "12345");
    const errand = new Errand("description", "details", "userid");

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(errand);

    const result = await sut.execute({
      userid: "userid",
      errandid: "errandid",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Errand requested cache");
  });

  test("Deveria retornar 200 se os recados forem listados", async () => {
    const sut = createSut();
    const user = new User("any_name", "12345");
    const errand = new Errand("description", "details", "userid");

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
    jest
      .spyOn(ErrandsRepository.prototype, "getById")
      .mockResolvedValue(errand);

    const result = await sut.execute({
      userid: "userid",
      errandid: "errandid",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Errand requested");
    expect(result.data).toStrictEqual(errand.toJson());
  });
});
