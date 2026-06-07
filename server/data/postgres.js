export function getPostgresAdapter() {
  return {
    name: "postgresql",
    enabled: Boolean(process.env.POSTGRES_URL),
    connectionUrl: process.env.POSTGRES_URL || null
  };
}