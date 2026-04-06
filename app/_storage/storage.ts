import RedisStorage from "./redis-storage";
import InMemoryStorage from "./in-memory-storage";

export const createStorage = () => {
  if (!!process.env.REDIS_URL) return new RedisStorage();

  return new InMemoryStorage();
};

export const storage = createStorage();
