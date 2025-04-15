import { CacheMetadata, UserData } from '../interfaces/index';
import { ServiceError } from '../core/errors';

export class CacheService {
  private static INITIAL_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days
  private static MAX_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  private static CACHE_NAME = 'user-data';

  static async getCachedData(userId: string): Promise<UserData | null> {
    try {
      const cacheKey = this.getCacheKey(userId);
      const cachedData = await caches.match(new Request(cacheKey));
      
      if (!cachedData) return null;

      return this.handleCacheHit(userId, cachedData);
    } catch (error) {
      throw ServiceError.create(
        'Failed to get cached data',
        'CACHE_READ_FAILED'
      );
    }
  }

  static async setCachedData(
    userId: string, 
    userData: UserData, 
    metadata?: CacheMetadata
  ): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(userId);
      const newMetadata = this.createMetadata(metadata);
      await this.writeToCache(cacheKey, userData, newMetadata);
    } catch (error) {
      throw new ServiceError({
        message: 'Failed to cache data',
        code: 'CACHE_WRITE_FAILED'
      });
    }
  }

  static async clearCache(userId: string): Promise<void> {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      await cache.delete(this.getCacheKey(userId));
    } catch (error) {
      throw new ServiceError({
        message: 'Failed to clear cache',
        code: 'CACHE_CLEAR_FAILED'
      });
    }
  }

  private static getCacheKey(userId: string): string {
    return `user_${userId}`;
  }

  private static async handleCacheHit(
    userId: string, 
    cachedData: Response
  ): Promise<UserData | null> {
    const data = await cachedData.json();
    const metadata: CacheMetadata = data.metadata;

    if (this.isCacheExpired(metadata)) {
      await this.clearCache(userId);
      return null;
    }

    await this.updateCacheMetadata(userId, data.userData, metadata);
    return data.userData;
  }

  private static async updateCacheMetadata(
    userId: string,
    userData: UserData,
    metadata: CacheMetadata
  ): Promise<void> {
    metadata.lastAccessed = Date.now();
    metadata.accessCount++;
    
    const newDuration = Math.min(
      this.INITIAL_DURATION * (1 + metadata.accessCount/10),
      this.MAX_DURATION
    );
    
    metadata.expiresAt = Date.now() + newDuration;
    await this.setCachedData(userId, userData, metadata);
  }

  private static isCacheExpired(metadata: CacheMetadata): boolean {
    return Date.now() > metadata.expiresAt;
  }

  private static createMetadata(metadata?: CacheMetadata): CacheMetadata {
    return metadata || {
      expiresAt: Date.now() + this.INITIAL_DURATION,
      lastAccessed: Date.now(),
      accessCount: 1
    };
  }

  private static async writeToCache(
    key: string, 
    userData: UserData, 
    metadata: CacheMetadata
  ): Promise<void> {
    const cache = await caches.open(this.CACHE_NAME);
    await cache.put(
      new Request(key),
      new Response(JSON.stringify({ userData, metadata }))
    );
  }
}