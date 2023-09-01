import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { DeleteUserUsecase } from "../../../../../src/app/features/user/usecases/delete-user.usecase";
import { User } from "../../../../../src/app/models/user";

describe("testando usecase de delete de um usuario", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    const repository = Database.connection.getRepository(UserEntity);

    await repository.clear();
  });

  const createSut = () => {
    return new DeleteUserUsecase();
  };

  test("Deveria retornar erro 404 se o usuario não for deletado", async () => {
    const sut = createSut();

    jest.spyOn(UserRepository.prototype, "delete").mockResolvedValue(undefined);

    const result = await sut.execute("any_userid");

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 404);
    expect(result.message).toBe("user was not found");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar 200 se o usuario for deletado", async () => {
    const sut = createSut();
    const user = new User("any_name", "12345");

    jest.spyOn(UserRepository.prototype, "delete").mockResolvedValue(1);
    jest.spyOn(UserRepository.prototype, "list").mockResolvedValue([user]);

    const result = await sut.execute("any_userid");

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("user was sucessfully deleted");
    expect(result.data).toStrictEqual([user.toJson()]);
  });
});
