import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("testando update do usuário", () => {
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

  test("Deveria retornar erro 400 se o userid não estiver no formato uuid", async () => {
    const result = await supertest(sut).put("/user/wqefdas").send({});

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user not logged in");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se o password não for informado", async () => {
    const result = await supertest(sut)
      .put("/user/9385c62c-b047-413a-9b06-390cd7186a1d")
      .send({});

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("new password not informed");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se o password informado for menor que 8", async () => {
    const result = await supertest(sut)
      .put("/user/9385c62c-b047-413a-9b06-390cd7186a1d")
      .send({ newPassword: "12345" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe(
      "Password is mandatory to have at least 8 characters"
    );
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 404 se não for encontrado o usuário no banco de dados", async () => {
    const result = await supertest(sut)
      .put("/user/9385c62c-b047-413a-9b06-390cd7186a1d")
      .send({ newPassword: "123456789" });

    expect(result).toBeDefined();
    expect(result.status).toBe(404);
    expect(result.status).toEqual(404);
    expect(result).toHaveProperty("status", 404);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("User was not found");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se a senha atual fornecido pelo usuário for diferente da salva no banco", async () => {
    const user = new User("any_username", "123456789");

    await createUser(user);

    const listUser = await new UserRepository().list();

    const result = await supertest(sut)
      .put(`/user/${listUser[0].userId}`)
      .send({ newPassword: "123456789" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Invalid current password");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar 200 se a senha for for atualizada", async () => {
    const user = new User("any_username", "123456789");

    await createUser(user);

    const listUser = await new UserRepository().list();

    const result = await supertest(sut)
      .put(`/user/${listUser[0].userId}`)
      .send({ currentPassword: "123456789", newPassword: "1234567890" });

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Password was successfully update");
    expect(result.body.ok).toBe(true);
  });
});
