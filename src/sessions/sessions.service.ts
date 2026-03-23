import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Session } from './types/sessions.types';

@Injectable()
export class SessionsService {
  private sessionTtl: number;

  constructor(
    private sessionRepository: SessionsRepository,
    private configService: ConfigService,
  ) {
    this.sessionTtl = this.configService.getOrThrow<number>('auth.sessionTtl');
  }

  async createSession(user_id: string, user_agent?: string, ip_address?: string) {
    const sessionId = uuid();
    const token_version = 1;
    const expires_at = new Date(Date.now() + Number(this.sessionTtl));

    await this.sessionRepository.createSession(
      sessionId,
      user_id,
      expires_at,
      token_version, 
      user_agent,
      ip_address,
    );

    return { sessionId , token_version};
  }

  async rotatetoken_version(sessionId: string, token_version:number): Promise<Session> {
   let session = await this.sessionRepository.incrementtoken_version(sessionId,token_version);
   return session
  }

  async validateSession(sessionId: string):Promise<Session> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) throw new UnauthorizedException("Session not found");

    if (session.revoked_at) throw new UnauthorizedException("Session revoked");

    if (session.expires_at < new Date()) throw new UnauthorizedException("Session expired");

    return session;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.sessionRepository.revokeSession(sessionId);
  }
  async revokeAllUserSessions(user_id: string): Promise<void> {
    await this.sessionRepository.revokeUserSessions(user_id);
  }
}
