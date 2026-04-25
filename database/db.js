import mysql from "mysql2/promise";
import { db_host, db_name, db_password, db_user } from "../config/index.js";

const pool = mysql.createPool({
  host: db_host,
  user: db_user,
  password: db_password,
  database: db_name,
  waitForConnections: true,
  connectionLimit: 5,
});

export const query = async (sql, params) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("DB Query Error ::", err.message);
  }
};

export default pool;
