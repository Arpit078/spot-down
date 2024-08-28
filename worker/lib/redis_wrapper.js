import { createClient } from 'redis';

const redis_client = createClient();

redis_client.on('error', err => console.log('Redis Client Error', err));

await redis_client.connect();

export { redis_client };