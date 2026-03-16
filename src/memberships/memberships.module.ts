import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';

@Module({
  providers: [MembershipsService]
})
export class MembershipsModule {}
