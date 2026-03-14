import 'dotenv/config';
import fs from 'fs';
import { Pool } from 'pg';
import path from 'path';

async function runMigrations() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  // bootstrap migrations table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const result = await pool.query('SELECT name FROM migrations');
  const executed = result.rows.map((r: any) => r.name);

  for (const file of files) {
    if (executed.includes(file)) {
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`Running migration: ${file}`);

    await pool.query(sql);

    await pool.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [file]
    );
  }

  console.log('Migrations complete');
  process.exit();
}

runMigrations();