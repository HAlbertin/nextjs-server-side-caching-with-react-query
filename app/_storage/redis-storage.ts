import { Redis } from "ioredis";
import { StorageDriver } from "./interface-storage";
import { MAX_STALE_TIME } from "../_constants/cache";

class RedisStorage implements StorageDriver {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL!);
  }

  async getItem(key: string) {
    return this.client.get(key);
  }

  async setItem(key: string, value: string) {
    await this.client.set(key, value, "PX", MAX_STALE_TIME);
  }

  async removeItem(key: string) {
    await this.client.del(key);
  }
}

export default RedisStorage;
