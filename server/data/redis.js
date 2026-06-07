export function getRedisAdapter() {
  return {
    name: "redis",
    enabled: Boolean(process.env.REDIS_URL),
    connectionUrl: process.env.REDIS_URL || null
  };
}