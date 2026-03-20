import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MembershipsRepository } from './memberships.repository';
import { MembershipsService } from './memberships.service';

@Module({
  providers: [MembershipsService,DatabaseService,MembershipsRepository],
})
export class MembershipsModule {}
