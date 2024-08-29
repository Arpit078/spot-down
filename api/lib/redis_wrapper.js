import { createClient } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();

const redis_client = createClient({
    url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`
});

redis_client.on('error', err => console.log('Redis Client Error', err));

await redis_client.connect();

export { redis_client };
