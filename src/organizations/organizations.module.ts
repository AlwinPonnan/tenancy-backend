import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { DatabaseService } from 'src/database/database.service';
import { OrganizationsRepository } from './organizations.repository';
import { MembershipsRepository } from 'src/memberships/memberships.repository';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [OrganizationsService,DatabaseService,OrganizationsRepository,MembershipsRepository,JwtTokenService],
  controllers: [OrganizationsController],
  imports: [JwtModule],
})
export class OrganizationsModule {}
