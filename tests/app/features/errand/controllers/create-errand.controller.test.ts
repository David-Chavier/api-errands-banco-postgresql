import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { ErrandEntity } from "../../../../../src/app/shared/database/entities/errand.entity";
import { ErrandsRepository } from "../../../../../src/app/features/errand/repositories/errands.repository";

describe("testando criação de um recado", () => {
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

  test("Deveria retornar erro 401 se o userid do usuário não for um uuid", async () => {
    const result = await supertest(sut).post(`/user/9385c62/errand`).send({});

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user not logged in");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se a description for de tamanho igual a 0", async () => {
    const result = await supertest(sut)
      .post(`/user/9385c62c-b047-413a-9b06-390cd7186a1d/errand`)
      .send({});

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe(
      "need to pass a description for the errand"
    );
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 401 se o usuario não for encontrado no banco de dados", async () => {
    const result = await supertest(sut)
      .post(`/user/9385c62c-b047-413a-9b06-390cd7186a1d/errand`)
      .send({ description: "alguma coisa" });

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("user was not found");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar 200 se o recado for criado com sucesso", async () => {
    const user = new User("any_username", "123456789");
    await createUser(user);

    const listUser = await new UserRepository().list();

    const result = await supertest(sut)
      .post(`/user/${listUser[0].userId}/errand`)
      .send({ description: "alguma coisa" });

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Errand was successfully add");
    expect(result.body.ok).toBe(true);
  });

  test("Deveria retornar erro 500 se ocorrer erro ao criar o recado", async () => {
    const user = new User("any_username", "123456789");
    await createUser(user);

    const listUser = await new UserRepository().list();

    jest.spyOn(ErrandsRepository.prototype, "create").mockImplementation(() => {
      throw new Error();
    });

    const result = await supertest(sut)
      .post(`/user/${listUser[0].userId}/errand`)
      .send({ description: "alguma coisa" });

    expect(result.status).toEqual(500);
  });
});
