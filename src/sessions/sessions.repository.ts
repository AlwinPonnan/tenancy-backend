import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Session } from './types/sessions.types';

@Injectable()
export class SessionsRepository {
  constructor(private readonly db: DatabaseService) {}

  async createSession(
    sessionId: string,
    user_id: string,
    expires_at: Date,
    token_version: number,
    user_agent?: string,
    ip_address?: string,
  ) {
    const query = `
    INSERT INTO sessions (id, user_id, expires_at, user_agent, ip_address, token_version)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
    await this.db.query(query, [
      sessionId,
      user_id,
      expires_at,
      user_agent ?? null,
      ip_address ?? null,
      token_version,
    ]);
  }

  async findById(sessionId: string): Promise<Session | null> {
    const query = `SELECT * from sessions where id = $1`;
    const result = await this.db.query(query, [sessionId]);

    return result.rows[0] ?? null;
  }

  async incrementtoken_version(
    sessionId: string,
    token_version: number,
  ): Promise<Session> {
    const query = `UPDATE sessions
    SET token_version = token_version + 1
    WHERE id = $1 AND token_version = $2 
    AND revoked_at is null 
    AND expires_at > NOW()
    RETURNING id, token_version
    `;

    const result = await this.db.query(query, [sessionId, token_version]);
    console.log(result, "result", token_version, "token_version recieved")
    return result.rows[0] ?? null;
  }

  async revokeSession(sessionId: string) {
    const query = `UPDATE sessions
        SET revoked_at = NOW()
        WHERE id = $1
    `;
    await this.db.query(query, [sessionId]);
  }

  async revokeUserSessions(user_id: string) {
    const query = `UPDATE sessions
        SET revoked_at = NOW()
        WHERE user_id = $1
        RETURNING id, user_id
    `;
    await this.db.query(query, [user_id]);
  }

  async deleteExpiredSessions() {
    const query = `DELETE FROM sessions 
        WHERE expires_at < NOW()
    `;
    await this.db.query(query);
  }
}
