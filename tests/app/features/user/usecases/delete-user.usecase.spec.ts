import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { DeleteUserUsecase } from "../../../../../src/app/features/user/usecases/delete-user.usecase";

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
});
