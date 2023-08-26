import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("testando delete de um usuário", () => {
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

  const sut = createApp();

  const createUser = async (user: User) => {
    const repository = new UserRepository();
    await repository.create(user);
  };

  test("Deveria retornar erro 400 se o userid não for valido", async () => {
    const result = await supertest(sut).delete(`/user/asdasd`).send();

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("userid is not valid");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 404 se o usuário não for encontrado no banco de dados", async () => {
    const result = await supertest(sut)
      .delete(`/user/9385c62c-b047-413a-9b06-390cd7186a1d`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(404);
    expect(result.status).toEqual(404);
    expect(result).toHaveProperty("status", 404);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user was not found");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 200 se o usuário for deletedo com sucesso", async () => {
    const user = new User("any_username", "12345");
    const user2 = new User("any_username2", "12345");
    await createUser(user);
    await createUser(user2);

    const listUser = await new UserRepository().list();

    const result = await supertest(sut)
      .delete(`/user/${listUser[0].userId}`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user was sucessfully deleted");
    expect(result.body.ok).toBe(true);
    // expect(result.body.data).toBe([user2.toJson()]);
  });
});
