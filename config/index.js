import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const jwt_secret = process.env.JWT_SECRET;

const redis_host = process.env.REDIS_HOST;
const redis_port = process.env.REDIS_PORT;

export {
  port,
  db_host,
  db_name,
  db_user,
  db_password,
  jwt_secret,
  redis_host,
  redis_port,
};
