dotenv.config();
import pkg from 'pg';
import dotenv from 'dotenv';


console.log('🔹 Variables cargadas:', process.env.PG_USER, process.env.PG_PASSWORD);


const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT
});
