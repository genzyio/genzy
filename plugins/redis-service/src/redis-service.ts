// a service to cache data in memory (Redis Mock)
export class RedisService {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: string) {
    this.cache.set(key, value);
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}
