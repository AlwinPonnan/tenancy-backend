import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User } from './types/user.types';

@Injectable()
export class UsersRepository {
  constructor(private db: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    return rows[0] || null;
  }
  async findAuthUserByEmail(email: string): Promise<User | null> {
    const query = `
    SELECT id, password_hash, is_disabled, deleted_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

    const result = await this.db.query(query, [email]);

    return result.rows[0] ?? null;
  }

  async saveRehashPassword(
    userId: string,
    password: string,
  ): Promise<User | null> {
    const rows = await this.db.query(
      `UPDATE users
SET password_hash = $2,
    updated_at = NOW()
WHERE id = $1`,
      [userId, password],
    );

    return rows[0] || null;
  }

  async createUser(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
  ) {
    await this.db.query(
      `
      INSERT INTO users (id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      `,
      [id, name, email, passwordHash],
    );
  }
}
