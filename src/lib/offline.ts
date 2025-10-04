interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

export class OfflineStorageService {
  private readonly DB_NAME = 'watertech_offline_db';
  private readonly CACHE_PREFIX = 'watertech_cache_';

  isOnline(): boolean {
    return navigator.onLine;
  }

  setupOnlineListener(
    onOnline: () => void,
    onOffline: () => void
  ): () => void {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }

  setCacheItem<T>(key: string, data: T, expiresInMs: number = 3600000): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: expiresInMs,
      };
      localStorage.setItem(
        `${this.CACHE_PREFIX}${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  getCacheItem<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(`${this.CACHE_PREFIX}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        this.removeCacheItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
      return null;
    }
  }

  removeCacheItem(key: string): void {
    try {
      localStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error('Failed to remove cached item:', error);
    }
  }

  clearAllCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  queueOfflineAction(action: {
    type: string;
    data: unknown;
    timestamp: number;
  }): void {
    try {
      const queueKey = `${this.CACHE_PREFIX}offline_queue`;
      const queue = this.getCacheItem<typeof action[]>(queueKey) || [];
      queue.push(action);
      this.setCacheItem(queueKey, queue, 86400000);
    } catch (error) {
      console.error('Failed to queue offline action:', error);
    }
  }

  getOfflineQueue(): Array<{
    type: string;
    data: unknown;
    timestamp: number;
  }> {
    const queueKey = `${this.CACHE_PREFIX}offline_queue`;
    return this.getCacheItem(queueKey) || [];
  }

  clearOfflineQueue(): void {
    const queueKey = `${this.CACHE_PREFIX}offline_queue`;
    this.removeCacheItem(queueKey);
  }

  getCacheSize(): number {
    let totalSize = 0;
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += item.length * 2;
          }
        }
      });
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
    }
    return totalSize;
  }
}

export const offlineService = new OfflineStorageService();
