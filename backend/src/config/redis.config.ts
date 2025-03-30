import { createClient, RedisClientType } from 'redis';
import NodeCache from 'node-cache';

export class CacheService {
  private redis: RedisClientType | null; // Redis client, null if not connected
  private cache: NodeCache; // In-memory fallback
  private useRedis: boolean; // Flag to track if Redis is active

  constructor() {
    // Initialize NodeCache as fallback
    this.cache = new NodeCache();
    this.useRedis = false;

    // Initialize Redis client
    this.redis = createClient({
      url: process.env.REDIS_ADDR || 'redis://localhost:6379', // Configurable via env
    });

    // Handle Redis errors
    this.redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.useRedis = false; // Fallback to NodeCache on persistent errors
    });

    // Attempt Redis connection
    this.connect();

    // Periodically clean up NodeCache (every 60 seconds)
    setInterval(() => this.cleanupNodeCache(), 60 * 1000);
  }

  private async connect() {
    try {
      await this.redis!.connect();
      console.log('Redis connected successfully');
      this.useRedis = true;
    } catch (err) {
      console.warn('Failed to connect to Redis, falling back to NodeCache:', err);
      this.useRedis = false;
    }
  }

  // Generic get method
  async get(key: string): Promise<string | undefined> {
    if (this.useRedis && this.redis) {
      const value = await this.redis.get(key);
      return value ?? undefined; // Normalize null to undefined
    } else {
      return this.cache.get(key);
    }
  }

  // Generic set method with TTL
  async set(key: string, value: string, ttl: number): Promise<boolean> {
    if (this.useRedis && this.redis) {
      await this.redis.setEx(key, ttl, value);
      return true;
    } else {
      return this.cache.set(key, value, ttl);
    }
  }

  // Generic delete method
  async del(key: string): Promise<number> {
    if (this.useRedis && this.redis) {
      return await this.redis.del(key);
    } else {
      return this.cache.del(key);
    }
  }

  // Flush all cache
  async flush(): Promise<void> {
    if (this.useRedis && this.redis) {
      await this.redis.flushAll();
    }
    this.cache.flushAll(); // Always flush NodeCache
  }

  // Blacklist-specific methods
  async addToBlacklist(token: string, expirationTime: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.set(key, '1', expirationTime); // Reuse set method
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const value = await this.get(key);
    return value !== undefined; // True if key exists
  }

  // Cleanup expired entries in NodeCache
  private cleanupNodeCache() {
    if (!this.useRedis) {
      const keys = this.cache.keys();
      const now = Date.now() / 1000; // NodeCache uses seconds
      keys.forEach((key) => {
        const ttl = this.cache.getTtl(key);
        if (ttl && now > ttl) {
          this.cache.del(key);
        }
      });
    }
  }

  // Optional: Disconnect Redis
  async disconnect() {
    if (this.useRedis && this.redis) {
      await this.redis.disconnect();
      console.log('Redis disconnected');
      this.useRedis = false;
    }
  }
}

export const cacheService = new CacheService();