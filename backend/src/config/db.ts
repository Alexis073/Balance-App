import { Pool } from "pg";
import dot from "dotenv";

dot.config();

export const db = new Pool({
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASS,
});
