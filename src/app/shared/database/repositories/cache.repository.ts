import { CacheDatabase } from "../../../../main/database/redis.connection";

export class CacheRepository {
  private _repository = CacheDatabase.connection;

  public async get(key: string) {
    const result = await this._repository.get(key);

    if (!result) {
      return null;
    }

    return JSON.parse(result);
  }

  public async set(key: string, value: any) {
    await this._repository.set(key, JSON.stringify(value));
  }

  public async setEx(key: string, value: any, seconds: number) {
    await this._repository.setex(key, seconds, JSON.stringify(value));
  }

  public async delete(key: string) {
    await this._repository.del(key);
  }
}
