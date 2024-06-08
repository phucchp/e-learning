import { Inject, Service } from 'typedi';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ContentNotFound, DuplicateError, NotEnoughAuthority, NotFound, RecordExistsError, ServerError } from '../utils/CustomError';
import * as crypto from 'crypto';
import Redis from 'ioredis';

@Service()
export class RedisService {

    private redis: Redis; // Create a Redis client
    
    constructor() {
        console.log("Redis service is initialize");
		this.redis = new Redis({
			host: 'redis',
			port: 6379,
		}); // Initialize the Redis client
	}

    public clearAllCache(){
		this.redis.flushall((err, reply) => {
			if (err) {
			  console.error(err);
			} else {
			  console.log('All Caches cleared:', reply === 'OK');
			}
		});
	}

    async getCache(cacheKey: string): Promise<any> {
        const cachedResults = await this.redis.get(cacheKey);
        if (cachedResults) {
            console.log('Get from cache redis');
            return JSON.parse(cachedResults);
        }

        return null;
    }

    async setCache(cacheKey: string, data: any, timeInSeconds: number): Promise<any> {
        await this.redis.set(cacheKey, JSON.stringify(data), 'EX', timeInSeconds);
    }

    async clearCacheByKey(key: string): Promise<void> {
        await this.redis.del(key, (err, reply) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Cache cleared for key "${key}":`);
            }
        });
    }
}