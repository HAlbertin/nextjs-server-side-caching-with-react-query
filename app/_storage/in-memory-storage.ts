import { MAX_STALE_TIME } from "../_constants/cache";
import { StorageDriver } from "./interface-storage";

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

class InMemoryStorage implements StorageDriver {
  async getItem(key: string): Promise<string | null> {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async setItem(key: string, value: string): Promise<void> {
    cache.set(key, { value, expiresAt: Date.now() + MAX_STALE_TIME });
  }

  async removeItem(key: string): Promise<void> {
    cache.delete(key);
  }
}

export default InMemoryStorage;
