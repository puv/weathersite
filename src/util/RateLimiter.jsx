class RateLimiter {
    constructor(maxRequests = 10, timeWindow = 60000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = new Map();
    }

    canMakeRequest(key) {
        const now = Date.now();
        const userRequests = this.requests.get(key) || [];

        // Filter out old requests outside the time window
        const recentRequests = userRequests.filter(
            timestamp => now - timestamp < this.timeWindow
        );

        this.requests.set(key, recentRequests);

        return recentRequests.length < this.maxRequests;
    }

    recordRequest(key) {
        const now = Date.now();
        const userRequests = this.requests.get(key) || [];
        userRequests.push(now);
        this.requests.set(key, userRequests);
    }

    getRemainingRequests(key) {
        const now = Date.now();
        const userRequests = this.requests.get(key) || [];
        const recentRequests = userRequests.filter(
            timestamp => now - timestamp < this.timeWindow
        );
        return Math.max(0, this.maxRequests - recentRequests.length);
    }

    getTimeUntilReset(key) {
        const now = Date.now();
        const userRequests = this.requests.get(key) || [];
        if (userRequests.length === 0) return 0;

        const oldestRequest = Math.min(...userRequests);
        const timeUntilReset = this.timeWindow - (now - oldestRequest);
        return Math.max(0, timeUntilReset);
    }

    cleanup() {
        const now = Date.now();
        for (const [key, timestamps] of this.requests.entries()) {
            const recentRequests = timestamps.filter(
                timestamp => now - timestamp < this.timeWindow
            );
            if (recentRequests.length === 0) {
                this.requests.delete(key);
            } else {
                this.requests.set(key, recentRequests);
            }
        }
    }
}

// Global rate limiters for different endpoints
const apiRateLimiter = new RateLimiter(30, 60000); // 30 requests per minute
const tileRateLimiter = new RateLimiter(100, 60000); // 100 tiles per minute

// Cleanup old entries every 5 minutes
setInterval(() => {
    apiRateLimiter.cleanup();
    tileRateLimiter.cleanup();
}, 5 * 60 * 1000);

// Wrapper for fetch with rate limiting
export async function rateLimitedFetch(url, options = {}, limiter = apiRateLimiter) {
    const key = options.key || 'default';

    if (!limiter.canMakeRequest(key)) {
        const timeUntilReset = limiter.getTimeUntilReset(key);
        const error = new Error('Rate limit exceeded');
        error.retryAfter = Math.ceil(timeUntilReset / 1000);
        error.remaining = limiter.getRemainingRequests(key);
        throw error;
    }

    limiter.recordRequest(key);

    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Queue-based request manager for handling rate limits gracefully
export class RequestQueue {
    constructor(rateLimiter, concurrency = 5) {
        this.rateLimiter = rateLimiter;
        this.concurrency = concurrency;
        this.queue = [];
        this.active = 0;
    }

    async add(fn, key = 'default') {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, key, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.active >= this.concurrency || this.queue.length === 0) {
            return;
        }

        const { fn, key, resolve, reject } = this.queue.shift();

        if (!this.rateLimiter.canMakeRequest(key)) {
            // Re-queue the request
            this.queue.unshift({ fn, key, resolve, reject });

            // Wait before retrying
            const timeUntilReset = this.rateLimiter.getTimeUntilReset(key);
            setTimeout(() => this.process(), Math.min(timeUntilReset, 1000));
            return;
        }

        this.active++;
        this.rateLimiter.recordRequest(key);

        try {
            const result = await fn();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.active--;
            this.process();
        }
    }

    getQueueLength() {
        return this.queue.length;
    }

    getActiveCount() {
        return this.active;
    }
}

// Export instances
export { apiRateLimiter, tileRateLimiter, RateLimiter };

// Helper to add rate limit info to responses
export function addRateLimitHeaders(response, key, limiter) {
    const remaining = limiter.getRemainingRequests(key);
    const resetTime = limiter.getTimeUntilReset(key);

    return {
        ...response,
        rateLimit: {
            limit: limiter.maxRequests,
            remaining: remaining,
            reset: Date.now() + resetTime
        }
    };
}
