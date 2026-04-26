import Redis from "ioredis";
import { redis_host, redis_port } from "./index.js";

export const redis = new Redis({
  host: redis_host,
  port: redis_port,
});

redis.on("connect", () => {
  console.error("Redis Connection Sucessful...");
});

redis.on("error", (err) => {
  console.error("Redis Connection Error:", err);
});
