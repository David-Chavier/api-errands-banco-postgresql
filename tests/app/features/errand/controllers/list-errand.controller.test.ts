import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { ErrandEntity } from "../../../../../src/app/shared/database/entities/errand.entity";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { Errand } from "../../../../../src/app/models/errand";

describe("testando a listagem dos recados", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  afterEach(async () => {
    const userRepository = Database.connection.getRepository(UserEntity);
    const errandRepository = Database.connection.getRepository(ErrandEntity);

    await errandRepository.clear();
    await userRepository.clear();
  });

  const sut = createApp();

  const createUser = async (user: User) => {
    const repository = new UserRepository();
    await repository.create(user);
  };

  const createErrand = async (userid: string, errand: Errand) => {
    const cacheRepository = new CacheRepository();
    await cacheRepository.set(`Errands from user: ${userid}`, errand);
  };

  test("Deveria retornar erro 401 se o userid do usuário não for um uuid", async () => {
    const result = await supertest(sut).get(`/user/9385c62/errand`).send({});

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user not logged in");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 401 se o usuario não for encontrado no banco de dados", async () => {
    const result = await supertest(sut)
      .get(`/user/9385c62c-b047-413a-9b06-390cd7186a1d/errand`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user not logged in");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar 200 se os recados forem listados com sucesso do banco cache", async () => {
    const user = new User("any_username", "123456789");
    await createUser(user);

    const listUser = await new UserRepository().list();

    const errand = new Errand("wrqf", "asfsdf", listUser[0].userId);

    await createErrand(listUser[0].userId, errand);

    const result = await supertest(sut)
      .get(`/user/${listUser[0].userId}/errand`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Errand list cache");
    expect(result.body.ok).toBe(true);
  });

  test("Deveria retornar 200 se os recados forem listados com sucesso do banco relacional", async () => {
    const user = new User("any_username", "123456789");
    await createUser(user);

    const listUser = await new UserRepository().list();

    const result = await supertest(sut)
      .get(`/user/${listUser[0].userId}/errand`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Errand list");
    expect(result.body.ok).toBe(true);
  });
});
