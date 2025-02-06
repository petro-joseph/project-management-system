// TODO: Replace with actual Redis implementation when network is available
class RedisService {
  private storage: Map<string, { value: string; expiry: number }>;

  constructor() {
    this.storage = new Map();
    console.warn('Using in-memory storage instead of Redis. This is temporary until Redis is properly configured.');
  }

  async addToBlacklist(token: string, expirationTime: number): Promise<void> {
    const expiry = Date.now() + expirationTime * 1000;
    this.storage.set(`blacklist:${token}`, { value: '1', expiry });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const data = this.storage.get(`blacklist:${token}`);
    if (!data) return false;

    if (Date.now() > data.expiry) {
      this.storage.delete(`blacklist:${token}`);
      return false;
    }

    return true;
  }

  // Cleanup expired tokens periodically
  private cleanup() {
    const now = Date.now();
    for (const [key, data] of this.storage.entries()) {
      if (now > data.expiry) {
        this.storage.delete(key);
      }
    }
  }
}

export const redisService = new RedisService();