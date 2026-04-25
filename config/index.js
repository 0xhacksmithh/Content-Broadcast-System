import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

export { port, db_host, db_name, db_user, db_password };
