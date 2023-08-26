import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { User } from "../../../../../src/app/models/user";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("testando listagem dos usuários", () => {
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

  const createUser = async (user: User) => {
    const repository = new UserRepository();
    await repository.create(user);
  };

  const sut = createApp();

  test("Deveria retornar status 200 se os usuarios forem listados", async () => {
    const user = new User("any_username", "12345");

    await createUser(user);

    const result = await supertest(sut).get("/user").send();

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result).toHaveProperty("body.data");
    expect(result.body.message).toBe("Registered users");
    expect(result.body.ok).toBe(true);
  });
});
