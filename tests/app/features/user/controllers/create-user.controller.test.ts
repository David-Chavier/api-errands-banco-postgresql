import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("testando criação de um usuario", () => {
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

  test("Deveria retornar erro 400 se não for informado o username", async () => {
    const result = await supertest(sut).post("/user").send({});

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Fill in the fields and try again");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se não for informado o password", async () => {
    const result = await supertest(sut)
      .post("/user")
      .send({ username: "any_username" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Fill in the fields and try again");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se o tamanho do username for menor que 4", async () => {
    const result = await supertest(sut)
      .post("/user")
      .send({ username: "eva", password: "12345" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe(
      "Username is mandatory to have at least 4 characters"
    );
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se o tamanho do password for menor que 8", async () => {
    const result = await supertest(sut)
      .post("/user")
      .send({ username: "any_username", password: "12345" });

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

  test("Deveria retornar erro 400 se username já existe", async () => {
    const user = new User("any_username", "12345");

    await createUser(user);

    const result = await supertest(sut)
      .post("/user")
      .send({ username: "any_username", password: "12345678" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Username already taken");
    expect(result.body.ok).toBe(false);
  });
});
