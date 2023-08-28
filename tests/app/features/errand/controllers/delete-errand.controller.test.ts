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
import { ErrandsRepository } from "../../../../../src/app/features/errand/repositories/errands.repository";

describe("testando a rota de delete de recados", () => {
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

  const createErrand = async (errand: Errand) => {
    const errandRepository = new ErrandsRepository();
    await errandRepository.create(errand);
  };

  test("Deveria retornar erro 401 se o userid do usuário não for um uuid", async () => {
    const result = await supertest(sut)
      .delete(`/user/9385c62/errand/124234`)
      .send({});

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user not logged in");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 401 se errandid não for um uuid", async () => {
    const result = await supertest(sut)
      .delete(`/user/9385c62c-b047-413a-9b06-390cd7186a1d/errand/dasfsdf`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("unidentified errand");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 401 se o usuario não for encontrado no banco de dados", async () => {
    const result = await supertest(sut)
      .delete(
        `/user/9385c62c-b047-413a-9b06-390cd7186a1f/errand/9385c62c-b047-413a-9b06-390cd7186a1d`
      )
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user was not found");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 404 se errandid não for encontrado no banco de dados", async () => {
    const user = new User("any_username", "123456789");
    await createUser(user);
    const listUser = await new UserRepository().list();

    const result = await supertest(sut)
      .delete(
        `/user/${listUser[0].userId}/errand/9385c62c-b047-413a-9b06-390cd7186a1d`
      )
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(404);
    expect(result.status).toEqual(404);
    expect(result).toHaveProperty("status", 404);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Errand was not found");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar 200 se o recado for deletado com sucesso", async () => {
    const user = new User("any_username", "123456789");
    await createUser(user);

    const listUser = await new UserRepository().list();

    const errand = new Errand("wrqf", "asfsdf", listUser[0].userId);
    await createErrand(errand);
    const listErrand = await new ErrandsRepository().list({
      userid: listUser[0].userId,
    });

    const result = await supertest(sut)
      .delete(`/user/${listUser[0].userId}/errand/${listErrand[0].id}`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Errand was successfully deleted");
    expect(result.body.ok).toBe(true);
  });
});
