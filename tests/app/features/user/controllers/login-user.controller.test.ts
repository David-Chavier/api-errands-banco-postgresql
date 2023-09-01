import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("testando login de usuário", () => {
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
    const result = await supertest(sut).post("/login").send({});

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
      .post("/login")
      .send({ username: "any_username" });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Fill in the fields and try again");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 401 se não for encontrado o usuário no banco de dados", async () => {
    const result = await supertest(sut)
      .post("/login")
      .send({ username: "any_username", password: "12345" });

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("invalid username or password");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar 200 se o usuario encontrado no banco de dados", async () => {
    const user = new User("any_username", "12345");

    await createUser(user);

    const result = await supertest(sut)
      .post("/login")
      .send({ username: "any_username", password: "12345" });

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("logged in user");
    expect(result.body.ok).toBe(true);
  });

  test("Deveria retornar erro 500 se ocorrer erro de servidor quando um usuário tentar fazer login", async () => {
    jest.spyOn(UserRepository.prototype, "login").mockImplementation(() => {
      throw new Error();
    });

    const result = await supertest(sut)
      .post("/login")
      .send({ username: "any_username", password: "12345" });

    expect(result.status).toBe(500);
  });
});
