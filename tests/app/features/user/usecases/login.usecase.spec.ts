import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { LoginUsecase } from "../../../../../src/app/features/user/usecases/login.usecase";

describe("testando usecase de login de um usuario", () => {
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
    return new LoginUsecase();
  };

  test("Deveria retornar erro 401 se o username ou password estiverem incorretos", async () => {
    const sut = createSut();

    const result = await sut.execute({
      username: "any_name",
      password: "12345",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(401);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 401);
    expect(result.message).toBe("invalid username or password");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar 200 se login for feito com sucesso", async () => {
    const sut = createSut();
    const user = new User("any_name", "12345");

    jest.spyOn(UserRepository.prototype, "login").mockResolvedValue(user);

    const result = await sut.execute({
      username: "any_name",
      password: "12345",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("logged in user");
    expect(result.data).toStrictEqual(user.toJson());
  });
});
