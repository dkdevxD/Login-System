import redis from 'redis';

export default redis.createClient({ prefix: 'blocklist:' });