import RedisStorage from "./redis-storage";
import LocalStorage from "./local-storage";

export const createStorage = () => {
  if (!!process.env.REDIS_URL) return new RedisStorage();

  return new LocalStorage();
};

export const storage = createStorage();
