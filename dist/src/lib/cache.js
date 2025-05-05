var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { trackError } from './monitoring';
class Cache {
    constructor(options = {}) {
        this.intervalId = null;
        this.cache = new Map();
        this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes by default
        this.maxSize = options.maxSize || 100; // Maximum number of items in cache
        this.cleanupInterval = options.cleanupInterval || 60 * 1000; // 1 minute by default
        this.startCleanupInterval();
    }
    set(key, value, options = {}) {
        try {
            const ttl = options.ttl || this.defaultTTL;
            const expires = Date.now() + ttl;
            // If cache is full, remove least recently used item
            if (this.cache.size >= this.maxSize) {
                this.removeLRU();
            }
            this.cache.set(key, { value, expires, lastAccessed: Date.now() });
            return true;
        }
        catch (error) {
            trackError(error, { context: 'cache.set', key });
            return false;
        }
    }
    get(key, options = {}) {
        try {
            const item = this.cache.get(key);
            if (!item)
                return null;
            const now = Date.now();
            const isExpired = now > item.expires;
            // Update last accessed time
            item.lastAccessed = now;
            this.cache.set(key, item);
            if (!isExpired) {
                return item.value;
            }
            // Handle stale-while-revalidate pattern
            if (options.staleWhileRevalidate) {
                return item.value;
            }
            this.cache.delete(key);
            return null;
        }
        catch (error) {
            trackError(error, { context: 'cache.get', key });
            return null;
        }
    }
    getOrSet(key_1, fetchFn_1) {
        return __awaiter(this, arguments, void 0, function* (key, fetchFn, options = {}) {
            try {
                // Try to get from cache first
                const cachedValue = this.get(key, options);
                if (cachedValue !== null) {
                    return cachedValue;
                }
                // If not in cache or expired, fetch fresh data
                const freshValue = yield fetchFn();
                this.set(key, freshValue, options);
                return freshValue;
            }
            catch (error) {
                trackError(error, { context: 'cache.getOrSet', key });
                throw error;
            }
        });
    }
    delete(key) {
        try {
            return this.cache.delete(key);
        }
        catch (error) {
            trackError(error, { context: 'cache.delete', key });
            return false;
        }
    }
    clear() {
        try {
            this.cache.clear();
        }
        catch (error) {
            trackError(error, { context: 'cache.clear' });
        }
    }
    // Clean up expired items
    cleanup() {
        try {
            const now = Date.now();
            for (const [key, item] of this.cache.entries()) {
                if (now > item.expires) {
                    this.cache.delete(key);
                }
            }
        }
        catch (error) {
            trackError(error, { context: 'cache.cleanup' });
        }
    }
    // Remove least recently used item
    removeLRU() {
        try {
            let oldestKey = null;
            let oldestAccess = Date.now();
            for (const [key, item] of this.cache.entries()) {
                if (item.lastAccessed < oldestAccess) {
                    oldestAccess = item.lastAccessed;
                    oldestKey = key;
                }
            }
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
        catch (error) {
            trackError(error, { context: 'cache.removeLRU' });
        }
    }
    // Start automatic cleanup interval
    startCleanupInterval() {
        if (this.intervalId !== null) {
            return;
        }
        this.intervalId = setInterval(() => {
            this.cleanup();
        }, this.cleanupInterval);
    }
    // Stop automatic cleanup
    stopCleanupInterval() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
export const cache = new Cache({
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 200,
    cleanupInterval: 60 * 1000 // 1 minute
});
