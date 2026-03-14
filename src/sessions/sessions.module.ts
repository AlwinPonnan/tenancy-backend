import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [SessionsService, DatabaseService, SessionsRepository],
})
export class SessionsModule {}
