export function getMongoAdapter() {
  return {
    name: "mongodb",
    enabled: Boolean(process.env.MONGODB_URI),
    connectionUri: process.env.MONGODB_URI || null
  };
}