import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthRepository {
  constructor(private db: DatabaseService) {}

  async findByEmail(email: string) {
    const rows = await this.db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    return rows[0] || null;
  }

  async createUser(
    id: string,
    name: string,
    email: string,
    password_hash: string
  ) {
    await this.db.query(
      `
      INSERT INTO users (id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      `,
      [id, name, email, password_hash]
    );
  }
}