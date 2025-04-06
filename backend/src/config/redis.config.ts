import { createClient, RedisClientType } from 'redis';

export class CacheService {
  private redis: RedisClientType;

  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_ADDR || 'redis://localhost:6379',
    });

    this.redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.connect().catch(err => {
      console.error('Initial Redis connection failed:', err);
    });
  }

  private async connect() {
    try {
      await this.redis.connect();
      console.log('Redis connected successfully');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      // Do not throw here to prevent crashing the app during startup
    }
  }

  async get(key: string): Promise<string | undefined> {
    const value = await this.redis.get(key);
    return value ?? undefined;
  }

  async set(key: string, value: string, ttl: number): Promise<boolean> {
    await this.redis.setEx(key, ttl, value);
    return true;
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }

  async flush(): Promise<void> {
    await this.redis.flushAll();
  }

  async addToBlacklist(token: string, expirationTime: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.set(key, '1', expirationTime);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const value = await this.get(key);
    return value !== undefined;
  }

  async disconnect() {
    await this.redis.disconnect();
    console.log('Redis disconnected');
  }
}

export const cacheService = new CacheService();