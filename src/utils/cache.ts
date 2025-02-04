import NodeCache from 'node-cache';

export class Cache {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }

  async get(key: string): Promise<string | undefined> {
    return this.cache.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<boolean> {
    return this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<number> {
    return this.cache.del(key);
  }

  async flush(): Promise<void> {
    this.cache.flushAll();
  }
}
